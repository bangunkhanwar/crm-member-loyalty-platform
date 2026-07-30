const data = await verifyOTP(phone, otp);
      const authData = {
        token: data.token,
        role: 'member',
        user: data.member,
      };