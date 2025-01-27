FROM containers.renci.org/helxplatform/jupyter/minimal-poetry-notebook:latest

USER root

RUN curl -sSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install nodejs
RUN npm i -g typescript@5.3.3

COPY . /home/$NB_USER/eduhelx-jupyterlab-student-ext

WORKDIR /home/$NB_USER/eduhelx-jupyterlab-student-ext
RUN pip install -e .
RUN jupyter labextension develop . --overwrite
RUN jupyter server extension enable eduhelx_jupyterlab_student
RUN jlpm install

WORKDIR /home/$NB_USER
USER $NB_USER
