import qs from 'qs';
import promisify from 'es6-promisify';
const parseString = promisify(require('xml2js').parseString);

const USERNAME = 'landonalder';
const PASSWORD = '';

const fetchGreatLakesId = async () => {
  const loginResponse = await fetch(
    'https://www.mygreatlakes.org/borrower/m/authentication/applogin',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'cookie': [
          'TLTSID=2fe36009.5562f9953d6b4',
          'JSESSIONID_oc_infoserv=0001FHSI28twJxuGfbYOCdwAnL3:19ia5a0s6',
          'GLDCID=.mad'
        ],
      },
      body: JSON.stringify({
        userId: USERNAME,
        password: PASSWORD,
        pin: '',
        deviceId: '86FB6D13-5788-42BC-B360-DA168130757E|IPHONE',
      }),
    }
  );

  if (loginResponse.status === 200) {
    const parsedResponse = await loginResponse.json();
    return parsedResponse.greatLakesId;
  } else {
    return await fetchGreatLakesId();
  }
}

const updateGreatLakesRegistration = (greatLakesId) => {
  return fetch(
    'https://www.mygreatlakes.org/borrower/m/notification/registrationUpdate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        id: greatLakesId,
        notificationTypes: ['PPMTREM', 'PPMTPOS'],
        registrationType: 'REGISTER',
        device: {
          type: 'iOS',
          appVersionNr: '22.0',
          id: 'be48a348e72fea62e4112080e08a84a30817e8608d47b26dcc7a54b5df1dbdd1',
          uuid: '86FB6D13-5788-42BC-B360-DA168130757E',
        }
      }),
    }
  );
}

const fetchGreatLakesBalance = async () => {
  const balanceResponse = await fetch(
    'https://www.mygreatlakes.org/borrower/m/accountData',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
  ); 

  const parsedResponse = await balanceResponse.json();
  return parsedResponse.summaries[0].totalBalance;
}

export const getGreatLakesBalance = async () => {
  const greatLakesId = await fetchGreatLakesId();
  await updateGreatLakesRegistration(greatLakesId);
  return parseFloat(await fetchGreatLakesBalance());
}

const fetchMohelaSessionToken = async () => {
  const sessionTokenResponse = await fetch(
    'https://www.mohela.com/MobileWebServices/MobLoginService.asmx/CheckLoginAndDevice2', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({
        LoginId: USERNAME,
        Source: 'ios',
        DeviceId: '5B3FB647-9D14-422E-8CA4-2189344BCEEF',
        DevicePrint: '5B3FB647-9D14-422E-8CA4-2189344BCEEF',
      })
    }
  );
  const sessionTokenRawXML = await sessionTokenResponse.text();
  const sessionTokenJSON = await parseString(sessionTokenRawXML);

  return sessionTokenJSON.LoginServiceResponse.SessionToken[0];
}

const loginToMohela = (sessionToken) => {
  return fetch(
    'https://www.mohela.com/MobileWebServices/MobLoginService.asmx/CheckPassword2', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({
        LoginId: USERNAME,
        Source: 'ios',
        DeviceId: '5B3FB647-9D14-422E-8CA4-2189344BCEEF',
        DevicePrint: '5B3FB647-9D14-422E-8CA4-2189344BCEEF',
        SessionToken: sessionToken,
        AccountType: 'B',
        PersonnelKey: -1,
        Success: true,
        InstalledApp: true,
        MoreThanOneLoan: null,
        CanPayOnline: null,
        CanPayLineItem: null,
        password: PASSWORD,
      })
    }
  );
}

const fetchMohelaBalance = async (sessionToken) => {
  const balanceResponse = await fetch(
    'https://www.mohela.com/MobileWebServices/MobAccountHomeService.asmx/GetAccountHomeDetails', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({
        PersonnelKey: '6167931',
        SessionToken: sessionToken,
      })
    }
  );
  const balanceRawXML = await balanceResponse.text();
  const balanceJSON = await parseString(balanceRawXML);

  return balanceJSON.AccountHomeServiceResponse.TotalBalance[0];
}

export const getMohelaBalance = async () => {
  const sessionToken = await fetchMohelaSessionToken();
  await loginToMohela(sessionToken);
  return parseFloat(await fetchMohelaBalance(sessionToken));
}