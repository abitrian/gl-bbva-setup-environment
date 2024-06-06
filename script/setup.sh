npm config set registry https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/gl-bbva-npm-virtual;
npm config set loglevel error;
curl -s -u$1:$2 https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure >> /github/home/.npmrc;
TOKEN=`curl -s -u$1:$2 https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth`;
echo //artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/gl-bbva-npm-virtual/:\\$TOKEN >> /github/home/.npmrc;
echo //artifactory.globaldevtools.bbva.com/artifactory/api/npm/:_authToken=$TOKEN >> /github/home/.npmrc;