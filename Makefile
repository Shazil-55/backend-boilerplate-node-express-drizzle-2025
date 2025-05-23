prepare:
	npm install
migrate:
	npx drizzle-kit generate  && npm run migrator
build:
	docker-compose build
dev:
	docker-compose up
stop:
	docker-compose stop
implode:
	docker-compose down -v
logs:
	docker-compose logs -f
start-prod:
	docker-compose -f docker-compose.prod.yml up
local-only-cleanup-database:
	npm run local-only-cleanup-database
ssh:
	sudo ssh -i ./pem/fileName.pem ubuntu@IP_ADDRESS
ssh-prod:
	sudo ssh -i ./pem/fileName.pem ubuntu@IP_ADDRESS
.PHONY: prepare migrate build dev stop implode logs start-prod local-only-cleanup-database
