=====CRIAR INSTAÂNCIA AWS======

*  INSTÂNCIA UBUNTU

APÓS INSTÂNCIA CRIADA E CONECTADA, ABRIR NO TERMINAL ATRVÉS DA PASTA REFERENTE A CHAVE E EXECUTAR O COMANDO.

ssh -i <nome do arquivo.pem> ubuntu@<colar id ipv4 da instância>

*TERMINAL CONECTADO
*EXECUTAR OS SEGUINTES COMANDO DE INSTALAÇÃO

1 - sudo apt-get update
2 - sudo apt-get install git-all -y
3 - sudo apt install nodejs -y
4 - sudo apt install npm -y
5 - wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
6 - sudo apt install ./google-chrome-stable_current_amd64.deb -y
7 - mkdir projects
8 - cd projects
9 - git clone <url github>
10 - cd <tab ou nome da pasta>
11 - npm install
