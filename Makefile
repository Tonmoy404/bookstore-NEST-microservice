start_db:
	@echo "Starting Database using Docker Compose"
	docker-compose up

start_app:
	@echo "Starting All Services...."
	@cd bookstore && yarn start:dev &
	@cd client && yarn start:dev &
	@cd user && yarn start:dev &