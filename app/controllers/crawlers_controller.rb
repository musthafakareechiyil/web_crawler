class CrawlersController < ApplicationController
  # Max depth set to 3, can be changed depends upon the purpose
  MAX_DEPTH = 3

  def index
    agent = Mechanize.new
    url = params[:url]

    if url.present?
      crawl_page(url, agent, depth: 0)
      render json: { success: true, message: 'Crawling completed successfully', crawled_pages: }
    else
      render json: { success: false, message: 'Missing URL paramenter' }
    end
  end

  private

  # Crawls a given URL up to a specified depth, extracting information from the HTML content.
  def crawl_page(url, agent, depth:)
    return if visited?(url) || depth > MAX_DEPTH

    begin
      uri = URI.parse(url)
    rescue URI::InvalidURIError
      Rails.logger.error "Invalid URI: #{url}"
      return
    end

    uri = URI(uri.to_s.force_encoding('ASCII-8BIT')) if uri.to_s.encoding.name == 'UTF-8'
    uri = URI(URI.encode_www_form_component(uri.to_s))
    URI(URI.decode_www_form_component(uri.to_s))

    begin
      page = agent.get(url.to_s)
      return unless page.is_a?(Mechanize::Page) && page.header['content-type']&.include?('text/html')

      process_page(page)
      mark_visited(url)
      process_links(page, agent, url, depth)
    rescue Mechanize::RedirectLimitReachedError => e
      Rails.logger.error "Redirect limit reached for : #{url}, #{e.message}"
    rescue URI::InvalidURIError
      Rails.logger.error "Invalid URI: #{url}"
    rescue Mechanize::ResponseCodeError => e
      handle_response_code_error(e, url)
    rescue Mechanize::ResponseReadError
      Rails.logger.error "Error reading the response for: #{url}"
    end
  end

  # Processes a Mechanize page, extracting information if it's HTML content.
  def process_page(page)
    return unless page.is_a?(Mechanize::Page) && page.header['content-type']&.include?('text/html')
    crawled_pages << {
      title: page.title,
      url: page.uri.to_s,
      dependencies: extract_dependencies(page)
    }
  end

  # Extracts dependencies (links, scripts, and images) from a Mechanize page.
  def extract_dependencies(page)
    dependencies = page.search('link[href], script[src], img[src]').map do |element|
      element['href'] || element['src']
    end
    dependencies
  end

  # Retrieves the list of crawled pages. Initializes the list if it doesn't exist.
  def crawled_pages
    @crawled_pages ||= []
  end

  # Checks if a URL has been visited during the crawling process.
  def visited?(url)
    @visited_urls ||= Set.new
    @visited_urls.include?(url)
  end

  # Marks a URL as visited to avoid redundant crawling.
  def mark_visited(url)
    @visited_urls ||= Set.new
    @visited_urls.add(url)
  end

  # Processes the links on a Mechanize page, recursively crawling them if they belong to the same domain.
  def process_links(page, agent, url, depth)
    page.links.each do |link|
      encoded_href = URI.encode_www_form_component(link.href)
      decoded_href = URI.decode_www_form_component(encoded_href)
      next_url = URI.join(url, decoded_href).to_s
      crawl_page(next_url, agent, depth: depth + 1) if same_domain?(url, next_url) && !visited?(next_url)
    end
  end

  # Handling invalid urls
  def handle_response_code_error(e, url)
    case e.response_code
    when '404'
      Rails.logger.error "Page not found (404) for: #{url}"
    when '403'
      Rails.logger.error "Access forbidden (403) for: #{url}"
    when '500'
      Rails.logger.error "Internal server error (500) for #{url}"
    else
      Rails.logger.error "Unhandled response code (#{e.response_code}) for: #{url}"
    end
  end

  # Checks if two URLs belong to the same domain.
  def same_domain?(url1, url2)
    URI.parse(url1).host == URI.parse(url2).host
  end
end
