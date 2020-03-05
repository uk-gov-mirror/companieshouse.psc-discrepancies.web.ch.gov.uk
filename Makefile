artifact_name       := psc-discrepancies-web
version             := "unversioned"

.PHONY: all
all: build

.PHONY: clean
clean:
	rm -f ./$(artifact_name)-*.zip
	rm -rf ./build-*
	rm -f ./build.log

.PHONY: build
build:
	npm i
	npm run build

.PHONY: lint
lint:
	npm run lint

.PHONY: sonar
sonar:
	npm run sonarqube

.PHONY: test
test:
	npm run coverage

.PHONY: test-unit
test-unit:
	npm run test

.PHONY: package
package: build
ifndef version
	$(error No version given. Aborting)
endif
	$(info Packaging version: $(version))
	$(eval tmpdir := $(shell mktemp -d build-XXXXXXXXXX))
	cp -r `ls -A | grep -v $(tmpdir)` $(tmpdir)
	cd $(tmpdir) && npm i --production
	rm $(tmpdir)/package.json $(tmpdir)/package-lock.json
	cd $(tmpdir) && zip -r ../$(artifact_name)-$(version).zip .
	rm -rf $(tmpdir)

.PHONY: dist
dist: lint test-unit clean package
