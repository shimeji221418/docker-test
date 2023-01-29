class Api::V1::UsersController < ApplicationController
    def index
        users = User.all.order(created_at: :asc)
        render status:200, json: users
    end

    def show
        @user = User.find(params[:id])
        render status:200, json: @user
    end
end
