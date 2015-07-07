# eric yi on 2014-05-06
# yi_xiaobin@163.com

NPM=npm
server=./webapp/server
node_modules=$(server)/node_modules

.PHONY : clean

install:
	$(NPM) install express
	$(NPM) install ejs@1.0.0
	$(NPM) install mysql
	$(NPM) install debug
	$(NPM) install static-favicon
	$(NPM) install morgan
	$(NPM) install cookie-parser
#	$(NPM) install body-parser@1.13.1
	$(NPM) install body-parser
#	$(NPM) install express-session@1.11.3
	$(NPM) install express-session
	$(NPM) install MD5
	$(NPM) install -g node-gyp 
	$(NPM) install multipart
	$(NPM) install posix
	$(NPM) install connect-busboy 
	$(NPM) install winston
	$(NPM) install express-winston
	mv node_modules $(server)

env:
	$(NPM) install -g express-generator

clean:
	$(RM) -rf $(node_modules)
