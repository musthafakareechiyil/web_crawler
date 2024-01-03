# frozen_string_literal: true

require 'test_helper'

class CrawlersControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get crawlers_index_url
    assert_response :success
  end

  test 'should get site_map' do
    get crawlers_site_map_url
    assert_response :success
  end
end
