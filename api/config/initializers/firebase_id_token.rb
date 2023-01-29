FirebaseIdToken.configure do |config|
    config.redis = Redis.new
    config.project_ids = ['docker-test-app-f6dd1']
  end