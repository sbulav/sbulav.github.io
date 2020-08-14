.PHONY: Dockerfile Dockerfile-dev help bash bash-dev
LOCAL_SRC ?= `pwd`
.DEFAULT: help

help:
	@echo "Local development using bundle and jekyll"
	@echo "make <target> where <target>:"
	@echo ""
	@echo " ### Choose command     ###"
	@echo "  serve          Build site and serve locally on http://0.0.0.0:8080"
	@echo "  clean          Removes all generated files"
	@echo "  clean-branches Removes all merged branches"


serve:
	echo "#Use bash --login to initialize ruby 2.6 in rvm!!"
	bundle exec jekyll serve -H 0.0.0.0 --watch --port 8080 --livereload

clean:
	bundle exec jekyll clean

clean-branches:
	git branch --merged | egrep -v "(^\*|master|dev)" | xargs git branch -d
