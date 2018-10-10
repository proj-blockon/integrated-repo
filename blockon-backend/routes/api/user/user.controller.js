const Account = require('../../../models/account');

/*
    POST /api/user
    {
      email|ethAddress
    }
*/

/**
 * 이메일 주소나 ethAddress로 Account 찾기
 * @param {*} req
 * @param {*} res
 */
exports.getAccount = (req, res) => {
  Account.findOne(req.body, (err, account) => {
    res.json(account);
  });
};

/*
    POST /api/user/email
    {
      value
    }
*/

/**
 * 자동완성을 위해 value로 시작하는 이메일 검색
 * @param {*} req
 * @param {*} res
 */
exports.getEmailList = async (req, res) => {
  const accounts = await Account.find(
    { email: new RegExp(`^${req.body.value}`) },
    '-_id'
  ).select('email');
  console.log(accounts);
  const emailList = accounts.map(account => account.email);
  res.json(emailList);
};

/*
    GET /api/user/:ethAddress
    {
      profile,
      email
    }
*/

exports.updateAccountByEthAddress = (req, res) => {
  const { profile, email } = req.body;

  Account.update(
    { ethAddress: req.params.ethAddress },
    {
      $set: {
        'profile.thumbnail': profile,
        email
      }
    },
    (err, output) => {
      res.json({ message: 'account updated' });
    }
  );
};

/*
    PUT /api/user/:ethAddress/address
    {
      accountAddress
    }
*/

/**
 * ethAddress와 일치하는 document에 accountAddress를 추가합니다.
 * @param {*} req
 * @param {*} res
 */
exports.updateAccountAddressByEthAddress = (req, res) => {
  Account.update(
    { ethAddress: req.params.ethAddress },
    { $set: req.body },
    (err, output) => {
      res.json({ message: 'account updated' });
    }
  );
};
