import axios from 'axios';

// Function to submit a work item to Autodesk
async function submitWorkItem() {
  const accessToken =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJjb2RlOmFsbCIsImRhdGE6cmVhZCIsImRhdGE6d3JpdGUiXSwiY2xpZW50X2lkIjoiVEdlREw0eDJUbFA2NTZCczVuakpQQmE2RFlUSzdoVnV6WVBTQW9zMTlKY01jTVdSIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoiUmtDeGYwTDNZaDVVNlBFd2htR0hlcUx2MG91QnhBeURuaGdMM0tlNFdWazQ3b1Y4VDdKUHo3MjUzT3hRZ2VnayIsImV4cCI6MTc0NTI0ODMyN30.A73wKyjQqcMI-ppxInqOrfeuR1r83Ja4t7iSDsG36ooLjTM0i6gWANfRZQTJNTWGkFoj_QajkI51NQrJZ44IuIiLsf-M0EEvElzSPBIPgdYb6aXPhGU6qRUUOcm8oqYPW-nUfoRq3385QL3pkA0b6zq850_1VsVEO58QMclBV4p1_pq4WZyjQsoig3GKTDQlaq920mPRsjyCfqU9co1Lk2ju2SQuo5clNK1xK25LGrWHgy2abvWry-Iw_6iPqcjVcvF_IQmGwvH39bdPOtFUefRloZerGuCIwVjIGl29wXzDcvItM-xUcNWHMmSwFDSZZvRI6DUzTaHZ0SPuENR8EA';

  const payload = {
    activityId: 'TGeDL4x2TlP656Bs5njJPBa6DYTK7hVuzYPSAos19JcMcMWR.Shapes+prod',
    arguments: {
      inputDwg: {
        url: 'https://vertify-analytics-v2-dev.s3.us-east-1.amazonaws.com/dwg-files/1745244972271-DwgFile.dwg',
        verb: 'get',
      },
      scriptFile: {
        url: 'https://vertify-analytics-v2-dev.s3.us-east-1.amazonaws.com/dwg-files/1745245267783-src-files1745242945178-user-7a3f3a25-3a40-4a5a-8bb5-4280c7f56fa5.scr',
        verb: 'get',
      },
      Result: {
        url: 'https://vertify-analytics-v2-dev.s3.us-east-1.amazonaws.com/dwg-files/1745244924018-DwgFile.dwg.dwg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWYJIA3JOEIB5YGPK%2F20250421%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250421T141524Z&X-Amz-Expires=1800&X-Amz-Signature=17d4efb61c0584eabd1487b4c067fd12e163f37c6152725704fd56b5631e85c2&X-Amz-SignedHeaders=host&x-amz-acl=public-read&x-id=PutObject',
        verb: 'put',
      },
    },
  };

  try {
    // Step 1: Submit WorkItem to Autodesk API to trigger the drawing operation
    const workItemResponse = await axios.post('https://developer.api.autodesk.com/da/us-east/v3/workitems', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('WorkItem Submitted:', workItemResponse.data);

    console.log('File uploaded to S3:', uploadResponse.status);
    return workItemResponse.data;
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    console.error('Status code:', error.response?.status);
  }
}

submitWorkItem();
