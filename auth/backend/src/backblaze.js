const BackblazeB2 = require('backblaze-b2');
const fs = require('fs');

const b2 = new BackblazeB2({
  applicationKeyId: '0058d52c265fba00000000001',
  applicationKey: 'K005w26Zp+Hggpe7XNkqL2voheDou1M',
});

b2.authorize().then(() => {
  const bucketId = 'b88d55422c7256d58fbb0a10';
  const file = 'backend/uploads/vid1.mp4';
  const remoteFileName = 'vid1.mp4';

  b2.uploadFile({
    uploadUrl: b2.getUploadUrl(bucketId),
    uploadAuthToken: b2.getUploadAuthToken(bucketId),
    filename: remoteFileName,
    data: fs.createReadStream(file),
  }).then(response => {
    console.log('File uploaded successfully:', response);
  }).catch(error => {
    console.error('Error uploading file:', error);
  });
});
