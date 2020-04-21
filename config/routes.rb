Rails.application.routes.draw do
  namespace :v1, defaults: { format: 'json' } do
    get 'things', to: 'things#index'
  end

  root 'static#index'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'
  # resources :users, only: [:create, :show, :index]
  resources :users, only: [:create, :show, :index]
  resources :mainusers, only: [:create, :show, :index]
  # Forward all requests to StaticController#index but requests
  # must be non-Ajax (!req.xhr?) and HTML Mime type (req.format.html?).
  # This does not include the root ("/") path.
  get '*page', to: 'static#index', constraints: ->(req) do
    !req.xhr? && req.format.html?
  end
end