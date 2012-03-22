test-all:
	@NODE_ENV=test node ./node_modules/mocha/bin/mocha

release:
	rm -fr ./.git
	rm -f ./.gitignore
	rm -fr ./test
