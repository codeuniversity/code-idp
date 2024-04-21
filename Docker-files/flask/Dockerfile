FROM python:3.12.3-slim AS base
# ------------------------ Initial image build ---------------------------
FROM base AS build

WORKDIR /usr/app

RUN python -m venv /usr/app/venv
ENV PATH="/usr/app/venv/bin:$PATH"

COPY requirements.txt .
RUN echo "gunicorn==20.0.4" >> requirements.txt

RUN apt-get update && apt-get install -y --no-install-recommends \
	      build-essential gcc && pip install -r requirements.txt

# ------------------------ Production Build -------------------------------
FROM base

RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python

RUN mkdir /usr/app && chown python:python /usr/app

WORKDIR /usr/app

COPY --chown=python:python --from=build /usr/app/venv ./venv
COPY --chown=python:python . .

USER 999

ENV PATH="/usr/app/venv/bin:$PATH"
CMD [ "gunicorn", "--bind", "0.0.0.0:3000", "manage:app" ]