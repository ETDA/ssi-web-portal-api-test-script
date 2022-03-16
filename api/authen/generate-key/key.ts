import axios from 'axios'
import { CONFIG } from '../../consts'

const genUploadMessage = (obj: {
  public_key: string, private_key: string, key_type: string
}) => {
  return {
    public_key: obj.public_key,
    private_key: obj.private_key,
    key_type: obj.key_type
  }
}

const genUploadx509Message = (obj: {
  x509_certificate: string, x509_key: string
}) => {
  return {
    x509_certificate: obj.x509_certificate,
    x509_key: obj.x509_key
  }
}

export class Key {

  static async GenKey (token: string) {
    return await axios.post(`${CONFIG.BASE_URL}/api/web/key/generate`,
      null, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async GenRSAKey (token: string) {
    return await axios.post(`${CONFIG.BASE_URL}/api/web/key/generate/rsa`,
      null, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async Upload (publicKey: string, privateKey: string, keyType: string, token: string) {
    const message = genUploadMessage({
      public_key: publicKey,
      private_key: privateKey,
      key_type: keyType
    })
    return await axios.post(`${CONFIG.BASE_URL}/api/web/key/upload`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }

  static async UploadX509 (cert: string, key: string, token: string) {
    const message = genUploadx509Message({
      x509_certificate: cert,
      x509_key: key
    })
    return await axios.post(`${CONFIG.BASE_URL}/api/web/key/upload/x509`,
      message, { headers: { 'Authorization': `FINEMA ${token}` } })
  }
}

export const x509_EXAMPLE = {
  CERTIFICATE: '\\n-----BEGIN CERTIFICATE-----\\nMIIDZDCCAkwCCQDKjUyeZr5xTzANBgkqhkiG9w0BAQUFADB0MQswCQYDVQQGEwJU\\nSDEQMA4GA1UECAwHQmFuZ2tvazEQMA4GA1UEBwwHQmFuZ2tvazEYMBYGA1UECgwP\\nRmluZW1hIENvLiwgTHRkMRMwEQYDVQQLDApUZWNobm9sb2d5MRIwEAYDVQQDDAlm\\naW5lbWEuY28wHhcNMjEwOTAyMDQ0MDMwWhcNMjIwOTAyMDQ0MDMwWjB0MQswCQYD\\nVQQGEwJUSDEQMA4GA1UECAwHQmFuZ2tvazEQMA4GA1UEBwwHQmFuZ2tvazEYMBYG\\nA1UECgwPRmluZW1hIENvLiwgTHRkMRMwEQYDVQQLDApUZWNobm9sb2d5MRIwEAYD\\nVQQDDAlmaW5lbWEuY28wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC0\\nh0SJcqIzFgq9d5vhb3Bs1g0ZCSGr3tVBh9LDnzh5kaDo0Hs+F53Ptho97lVF0ziZ\\na6G5rq6wl5jQ10Hwx0vMz6JSEhpywNoEYl/OGIae8JVo/5mgRK2DTb3CSlXbChap\\n31OxLDIpb4OI+bchbaTh1y/koavXlUZr5KvmIWt1iv+fIbZoyEwd1kWUZw2bbO+s\\nwy7gIzW0i5z67kaTIZRNV1f+5vWlK4wGU1MbLKjJdc9AxKSQfZbHibTUQjXExt9h\\nQfHAkZ5OaFURWhf1bhgglGaNK2JAfuKS3gTNmFL3/z+PbAQ2Mw/UP0mMc/8+OIfQ\\nEryyPme0/X/nIWZ7iO8RAgMBAAEwDQYJKoZIhvcNAQEFBQADggEBAIHuHvsieXhG\\nASzt2JYEespgGxPMydziIu3A2ACuhzPlvMcvHvkuHO1kj6zjxFdYE1ANDnS3UoGt\\n+4q53Ayal6HVAihx/GsSE4NcVXMLqVyHlPZhuFUSiVxDUflclzAK19qAfOvj5kcr\\ngsBcScxGozJB7pmjd4tL/GyTCBV8HLBKX3+7p5XtoQvGU7HaXieV5R9RDENieCDn\\nZYQ5HAkjqSWDwTVxG2H8C4kTFGebAa4oxMpxv5wSXxmXWlF6pVrrL6UgoAUTnqhP\\n8gH8DlnSy5gxXj6Yt0gGB4QUq8b0fnHpox/Q+MciH0fW87GQFxMnV/PWDocS8lt8\\n3xB9OIgPFNQ=\\n-----END CERTIFICATE-----',
  KEY: '\\n-----BEGIN RSA PRIVATE KEY-----\\nMIIEowIBAAKCAQEAtIdEiXKiMxYKvXeb4W9wbNYNGQkhq97VQYfSw584eZGg6NB7\\nPhedz7YaPe5VRdM4mWuhua6usJeY0NdB8MdLzM+iUhIacsDaBGJfzhiGnvCVaP+Z\\noEStg029wkpV2woWqd9TsSwyKW+DiPm3IW2k4dcv5KGr15VGa+Sr5iFrdYr/nyG2\\naMhMHdZFlGcNm2zvrMMu4CM1tIuc+u5GkyGUTVdX/ub1pSuMBlNTGyyoyXXPQMSk\\nkH2Wx4m01EI1xMbfYUHxwJGeTmhVEVoX9W4YIJRmjStiQH7ikt4EzZhS9/8/j2wE\\nNjMP1D9JjHP/PjiH0BK8sj5ntP1/5yFme4jvEQIDAQABAoIBADx2qa/XYxf1I/e9\\nXcothtwM/SoLcumbopVmJmM6qrGc4uXXHc/4HPT6quNfNdRDIEvSTsJgDUY8IASi\\ndAVu2qZoTJdsVMtmaB7by/a9JCmLrp8SLKQPHIZDvXCbcRIB2QFgOSm4Abz7CnUQ\\nHhPmIzk412Od+m4kIwfz+NcFDna5XHH6U2PDxoq3garD0Cz4oTjrgAZagH6FJK9y\\nvHRV50udBkX39XZJpn8g5jQHDXPpyzOjzcMQ0wsuK9nDAfxfsZuqKnImpyHayhZQ\\nJojD9QdH2H13aXZ/PrBPye35I4mLnVl0W+VUtjVMDjim2/Tp85PabWy1FA8WKhyU\\n3quaEJkCgYEA79aXa4FS07pauxAPSwdnUY+Ij5FSgRISe7e3Py0Jq9Iq8yFdpHvC\\n/+SUHjux6nNwQJAD0wCbbFHW3tgiLzfv4FrYOt5/KLB0jMXW2VH/tXsif4DYT+mb\\nTIUIYeLdC9W1u7t1TTojc33sUgtQOEi1+Sr+6tetOp0iA92Lu9vYYvMCgYEAwLGI\\nM14OgcKC1mpvGSGBqWLBLW7tvHvHrU2r8Es3zHj6INv4inJnrNlH5zX06A30Np56\\nN/Ov/ayd1Kf0sHZJnny/P6NiDiNaZJx5OmHnSPk4hh1IkHB+DwbI2eAJMQlWqQUj\\nRkc7lchWVNKOrAU7jESUKphQ7Zk+HXdYGGOj/usCgYAFPoL3Fc/S01tShcpf0Jyg\\nuuu4f+v26IdA70ZxejGg8SqBQHSEuTQNVlkqxBFi1/1XXA7JWVUMrElve/hbYfS7\\nyiC6QM00/Y6+2UCWZeWaeUPK1+1i6e+8X5hMU6KTtKuRnEq3UpMd3l4BeT/ayzQ3\\na4pBZk/iXTc2MGzywZ7cowKBgQC99YX+laeZdgaDl9NEJArt0CP+RQ/qst/K0fpB\\nXfV5Bn4WrKOc4GGiPWUr4r43kaIBwkNcK0iAvI2vWY/X8hRrQDFNbCS7KVDwRG0i\\nB+f4wW9ejzm84pjy+U5BsyF8jOc4oo7+tjRgWWn6HsR1gocMpYKnZxbI1Dwu0jsv\\nd/Lw1wKBgCurT5h9EV5bO2A4FJdUoJcGyFA7SqqJGvhuT1RCKhSzhMYaLaU+oZ/L\\np8pwWuk0u7dp0+SNvXOLsi4R38CIPeZrDbY1jKpDX5R0s455Nh6ozcQmiaXM7hPW\\nFQ8D+G+6qsFvplLvlqsLBT/VCuoKz22h1RnMbcQEYIFOanWHtG+M\\n-----END RSA PRIVATE KEY-----'
}
