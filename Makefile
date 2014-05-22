# eric yi on 2014-05-06
# yi_xiaobin@163.com

NPM									=npm
server							=./webapp/server
node_modules				=$(server)/node_modules

.PHONY : clean

install:
	$(NPM) install express
	$(NPM) install ejs
	$(NPM) install mysql
	$(NPM) install debug
	$(NPM) install static-favicon
	mv node_modules $(server)

env :
	$(NPM) install -g express-generator

clean:
	$(RM) -rf $(node_modules)
