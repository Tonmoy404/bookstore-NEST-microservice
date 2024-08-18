start_db:
	@echo "Starting Database using Docker Compose"
	docker-compose up

start_app:
	@echo "Starting app...."
	@cd bookstore && yarn start:dev &
	@cd client && yarn start:dev &
	@cd user && yarn start:dev &

start_services:
	@echo "Starting All Services...."
	@start wsl.exe bash -c "cd /mnt/e/Nest/bookStore/bookstore && yarn start:dev; exec bash" &
	@start wsl.exe bash -c "cd /mnt/e/Nest/bookStore/client && yarn start:dev; exec bash" &
	@start wsl.exe bash -c "cd /mnt/e/Nest/bookStore/user && yarn start:dev; exec bash" &
