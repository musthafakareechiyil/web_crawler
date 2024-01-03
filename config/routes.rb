# frozen_string_literal: true

Rails.application.routes.draw do
  # Define a route for the home contoller's index action
  get 'home/index'

  # Define a route for the crawlers controller's index action
  get 'crawlers/index'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
