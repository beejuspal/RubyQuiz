class MainUsersController < ApplicationController
    
    def index
        @mainusers = MainUser.all
        if @mainusers
          render json: {
            main_users: @mainusers
          }
        else
          render json: {
            status: 500,
            errors: ['no users found']
          }
        end
    end
    def show
        @mainuser = MainUser.find(params[:id])
       if @mainuser
          render json: {
            mainuser: @mainuser
          }
        else
          render json: {
            status: 500,
            errors: ['user not found']
          }
        end
      end
      
      def create
        
        @mainuser = MainUser.new(user_params)
        if @mainuser.save
          login!
          render json: {
            status: :created,
            main_user: @mainuser
          }
        else 
          render json: {
            status: 500,
            errors: @mainuser.errors.full_messages
          }
        end
      end
    private
      
      def user_params
        params.require(:mainuser).permit( :email, :password)
      end
    end