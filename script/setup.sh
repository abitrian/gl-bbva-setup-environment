npm config set registry https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/$3;
npm config set loglevel error;
TOKEN=`curl -s -u$1:$2 https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth`;
echo //artifactory.globaldevtools.bbva.com/artifactory/api/npm/:$TOKEN >> /github/home/.npmrc;