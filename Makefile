# eric yi on 2014-05-06
# yi_xiaobin@163.com

NPM				=npm

.PHONY : clean

install :
	$(NPM) install

env :
	$(NPM) install -g express-generator
	$(NPM) install jade
