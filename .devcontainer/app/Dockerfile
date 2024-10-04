FROM mcr.microsoft.com/devcontainers/typescript-node:18

RUN sudo apt update -y \
  && corepack enable \
  && sudo apt install redis-tools -y


COPY .git-completion.bash /home/node/.git-completion.bash
RUN echo "\nif [ -f ~/.git-completion.bash ]; then\n  . ~/.git-completion.bash\nfi" >> /home/node/.bashrc
