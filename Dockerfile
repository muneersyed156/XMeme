FROM ubuntu

EXPOSE 8081
EXPOSE 27017

#RUN apt install -y mongodb

COPY ./portal_flask.py .
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt

CMD ["python3","portal_flask.py"]
