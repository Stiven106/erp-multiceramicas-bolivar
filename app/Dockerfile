FROM python:3.12.3-alpine3.19

EXPOSE 5000

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY . ./

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

CMD [ "gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app" ]