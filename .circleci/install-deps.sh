if [ "${CIRCLE_BRANCH}" == "master" ]; then
  echo ">>> Installing Deployment Dependencies"
  sudo pip install awscli==1.14.40
  sudo apt-get -y install gettext-base
else
  if [ ! -d "./node_modules" ]; then
    echo ">>> Installing Node packages using NPM"
    sudo npm install --no-progress -s
  else
    echo ">>> Using cached 'node_modules'"
  fi
fi
