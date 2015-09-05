Rails.application.routes.draw do
#  root 'home#index'
  root 'home#index'
  get '/:controller/:action'
  
  post '/:controller/:action'
end
