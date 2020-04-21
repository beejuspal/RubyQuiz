class Quiz_UserController < ApplicationController
    def index
      @quiz_users = User.all
        if @quiz_users
          render json: {
            users: @quiz_users
          }
        else
          render json: {
            status: 500,
            errors: ['no users found']
          }
        end
    end
    def show
        @quiz_users = User.find(params[:id])
       if @quiz_users
          render json: {
            user: @quiz_users
          }
        else
          render json: {
            status: 500,
            errors: ['user not found']
          }
        end
      end
      
      def create
        @quiz_users = User.new(user_params)
        if @quiz_users.save
          login!
          render json: {
            status: :created,
            user: @quiz_users
          }
        else 
          render json: {
            status: 500,
            errors: @quiz_users.errors.full_messages
          }
        end
      end
    private
      
      def user_params
        params.require(:user).permit(:email, :password)
      end
    end