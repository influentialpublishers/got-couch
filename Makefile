NODE_BIN=./node_modules/.bin


install:
	yarn install

test: install
	${NODE_BIN}/ava --verbose test


.PHONY: test
