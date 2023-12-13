FROM --platform=linux/amd64 python:3.9-buster
COPY . .

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

RUN apt-get -y update && apt-get install -y google-chrome-stable netcat
ENV DISPLAY=:99

RUN pip install -r requirements.txt
RUN chmod +x ./wait_server.sh

CMD ./wait_server.sh node_server 3000 60 && python /tests/test_landing.py