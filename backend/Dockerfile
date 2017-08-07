FROM alpine

RUN apk add --no-cache python3 bash

ENV PYTHON_PIP_VERSION 9.0.1

RUN set -ex; \
	\
	apk add --no-cache --virtual .fetch-deps libressl; \
	\
	wget -O get-pip.py 'https://bootstrap.pypa.io/get-pip.py'; \
	\
	apk del .fetch-deps; \
	\
	python3 get-pip.py \
		--disable-pip-version-check \
		--no-cache-dir \
		"pip==$PYTHON_PIP_VERSION" \
	; \
	pip3 --version; \
	\
	find /usr/local -depth \
		\( \
			\( -type d -a \( -name test -o -name tests \) \) \
			-o \
			\( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
		\) -exec rm -rf '{}' +; \
	rm -f get-pip.py

RUN adduser -Dg "" -Hs /bin/bash viperid

RUN mkdir /app/

WORKDIR /app/

RUN apk add --no-cache --virtual .build-deps libressl-dev libffi-dev git gcc python3-dev linux-headers musl-dev

COPY . .

RUN pip3 install -r requirements.txt

RUN apk del .build-deps

RUN chown -R viperid:viperid /app/

EXPOSE 5000

WORKDIR /app/viperid/

ENTRYPOINT ["/app/entrypoint.sh"]
