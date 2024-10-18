import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import Button from "@/src/components/Button/Button";
import InputField from "@/src/components/Input/InputField";
import { onBoardingTheme } from "@/src/contexts/Theme";
import { useAppSelector } from "@/src/stores/Theme";
import Layout from "@/src/contexts/Layout";
import { showErrorToast, showSuccessToast } from "@/src/components/Toast/Toast";
import { auth } from "@/src/firebase/firebase";
import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import { codeToMessage } from "@/src/firebase/HandleError";
import * as Google from "expo-auth-session/providers/google";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { user, setUser } = useContext(RegistrationContext);
  const currentTheme =
    onBoardingTheme[useAppSelector((state) => state.theme.currentTheme)];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const WEB_CLIENT_ID =
    "128092772318-8r1p37htnsmef4o2spmn2nok95r9vl26.apps.googleusercontent.com";
  const ANDROID_CLIENT_ID =
    "128092772318-smk7vfnvjjerfcl0kn7c5ljet3i7tgl9.apps.googleusercontent.com";
  const IOS_CLIENT_ID =
    "128092772318-4d29qnvqkmngpqdmn6bd2puirnh80dra.apps.googleusercontent.com";

  const [request, response, prompAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    handleGoogleLogin();
  }, [response]);

  const handleGoogleLogin = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const accessToken = authentication?.accessToken;
      if (accessToken) {
        getUserInfo(accessToken);
      } else {
        showErrorToast(
          "Không thể đăng nhập bằng Google do đã xảy ra lỗi dịch vụ"
        );
      }
    }
  };

  const getUserInfo = async (accessToken: string) => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );

      const userInfo = await response.json();
      console.log("User info:", userInfo as any);
      setUser(userInfo as any);
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  async function handleSigninWithGoogle() {
    try {
      console.log("Prompting Google sign in");
      await prompAsync();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }

  const handleLogin = async () => {
    if (email === "") {
      showErrorToast("Username hoặc email không được để trống");
      return;
    }

    // checking if the email format is correct
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailPattern.test(email)) {
      showErrorToast("Username hoặc email không hợp lệ");
      return true;
    }

    // checking if the username format is correct
    const usernamePattern = /^[a-zA-Z0-9._-]{3,}$/;
    if (!usernamePattern.test(email)) {
      showErrorToast("Username hoặc email không hợp lệ");
      return false;
    }

    // checking if the password is empty
    if (password === "") {
      showErrorToast("Mật khẩu không được để trống");
      return false;
    }

    try {
      const finalUsername = email.includes("@") ? email : email + "@tamais.me";

      await signInWithEmailAndPassword(auth, finalUsername, password);
      showSuccessToast("Đăng nhập thành công");
    } catch (error) {
      const errorCode = (error as AuthError).code;
      const errorMessage = codeToMessage(errorCode);
      showErrorToast(errorMessage);
      return;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: "center" }}>
          <SvgXml
            xml={`<svg xmlns="http://www.w3.org/2000/svg" width="874.24191" height="466.98646" viewBox="0 0 874.24191 466.98646" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="755.89902" cy="121" r="47" fill="#ff6584"/><path d="M408.89902,313.4105c0,124.1688-79.50322,153.57596-190.57819,153.57596s-143.35528-2.92855-143.35528-127.09735S-68.99681,0,42.07816,0,408.89902,189.2417,408.89902,313.4105Z" fill="#f2f2f2"/><path d="M742.37156,441.69039H164.64695c-14.68799,0-26.6377-11.94971-26.6377-26.6377V136.32809c0-14.68799,11.94971-26.6377,26.6377-26.6377H742.37156c14.68799,0,26.6377,11.94971,26.6377,26.6377V415.0527c0,14.68799-11.94971,26.6377-26.6377,26.6377ZM164.64695,111.69039c-13.58545,0-24.6377,11.05225-24.6377,24.6377V415.0527c0,13.58545,11.05225,24.6377,24.6377,24.6377H742.37156c13.58545,0,24.6377-11.05225,24.6377-24.6377V136.32809c0-13.58545-11.05225-24.6377-24.6377-24.6377H164.64695Z" fill="#3f3d56"/><g><ellipse cx="275.14799" cy="421.13573" rx="7.55666" ry="1.22626" transform="translate(-10.70473 7.19136) rotate(-1.46885)" fill="#e6e6e6"/><ellipse cx="323.02986" cy="417.14795" rx="7.55666" ry="1.22626" transform="translate(-10.58678 8.41743) rotate(-1.46885)" fill="#3f3d56"/><ellipse cx="255.87439" cy="412.88994" rx="7.55666" ry="1.22626" transform="translate(-10.4997 6.6946) rotate(-1.46885)" fill="#ff6584"/><ellipse cx="236.57939" cy="410.44305" rx="1.10248" ry="3.35719" transform="translate(-176.51551 642.36093) rotate(-89.35138)" fill="#e6e6e6"/><ellipse cx="224.86657" cy="403.9735" rx="1.10248" ry="3.35719" transform="translate(-181.62661 624.25255) rotate(-89.35138)" fill="#3f3d56"/><ellipse cx="288.56759" cy="412.78998" rx="1.10248" ry="3.35719" transform="translate(-127.46262 696.66616) rotate(-89.35138)" fill="#e6e6e6"/><ellipse cx="266.85937" cy="416.88456" rx="1.10248" ry="3.35719" transform="translate(-153.01941 679.00756) rotate(-89.35138)" fill="#ff6584"/><ellipse cx="302.83863" cy="419.91415" rx="1.10248" ry="3.35719" transform="translate(-120.47685 717.97982) rotate(-89.35138)" fill="#3f3d56"/></g><g><ellipse cx="635.14799" cy="419.13573" rx="7.55666" ry="1.22626" transform="translate(-10.53517 16.41873) rotate(-1.46885)" fill="#e6e6e6"/><ellipse cx="683.02986" cy="415.14795" rx="7.55666" ry="1.22626" transform="translate(-10.41722 17.6448) rotate(-1.46885)" fill="#3f3d56"/><ellipse cx="615.87439" cy="410.88994" rx="7.55666" ry="1.22626" transform="translate(-10.33014 15.92197) rotate(-1.46885)" fill="#ff6584"/><ellipse cx="596.57939" cy="408.44305" rx="1.10248" ry="3.35719" transform="translate(181.40905 1000.3605) rotate(-89.35138)" fill="#e6e6e6"/><ellipse cx="584.86657" cy="401.9735" rx="1.10248" ry="3.35719" transform="translate(176.29794 982.25213) rotate(-89.35138)" fill="#3f3d56"/><ellipse cx="648.56759" cy="410.78998" rx="1.10248" ry="3.35719" transform="translate(230.46193 1054.66574) rotate(-89.35138)" fill="#e6e6e6"/><ellipse cx="626.85937" cy="414.88456" rx="1.10248" ry="3.35719" transform="translate(204.90515 1037.00713) rotate(-89.35138)" fill="#ff6584"/><ellipse cx="662.83863" cy="417.91415" rx="1.10248" ry="3.35719" transform="translate(237.44771 1075.97939) rotate(-89.35138)" fill="#3f3d56"/></g><g><ellipse cx="467.14799" cy="422.13573" rx="7.55666" ry="1.22626" transform="translate(-10.66728 12.11331) rotate(-1.46885)" fill="#e6e6e6"/><ellipse cx="515.02986" cy="418.14795" rx="7.55666" ry="1.22626" transform="translate(-10.54932 13.33937) rotate(-1.46885)" fill="#3f3d56"/><ellipse cx="447.87439" cy="413.88994" rx="7.55666" ry="1.22626" transform="translate(-10.46224 11.61655) rotate(-1.46885)" fill="#ff6584"/><ellipse cx="428.57939" cy="411.44305" rx="1.10248" ry="3.35719" transform="translate(12.31105 835.33731) rotate(-89.35138)" fill="#e6e6e6"/><ellipse cx="416.86657" cy="404.9735" rx="1.10248" ry="3.35719" transform="translate(7.19995 817.22893) rotate(-89.35138)" fill="#3f3d56"/><ellipse cx="480.56759" cy="413.78998" rx="1.10248" ry="3.35719" transform="translate(61.36394 889.64254) rotate(-89.35138)" fill="#e6e6e6"/><ellipse cx="458.85937" cy="417.88456" rx="1.10248" ry="3.35719" transform="translate(35.80716 871.98394) rotate(-89.35138)" fill="#ff6584"/><ellipse cx="494.83863" cy="420.91415" rx="1.10248" ry="3.35719" transform="translate(68.34972 910.95619) rotate(-89.35138)" fill="#3f3d56"/></g><path d="M225.16031,365.06778c-2.55576,.16004-3.96822-3.01527-2.03464-4.86593l.19236-.76476c-.02533-.06125-.05078-.12243-.07643-.18358-2.58461-6.16299-11.34412-6.12047-13.90674,.05167-2.27452,5.4781-5.17037,10.96553-5.8834,16.75771-.31965,2.55684-.17582,5.16164,.39152,7.67061-5.32952-11.64185-8.13413-24.35434-8.13413-37.13874,0-3.21216,.17582-6.42428,.53535-9.6283,.29566-2.62085,.70315-5.22564,1.23055-7.80653,2.85245-13.95104,9.02901-27.23882,17.93812-38.33731,4.2828-2.34119,7.85444-6.00074,10.0118-10.38735,.77504-1.58214,1.38233-3.28404,1.66998-5.0179-.48739,.06393-1.83779-7.3591-1.47018-7.81452-.67924-1.03071-1.89496-1.54307-2.6368-2.54885-3.68944-5.0021-8.77254-4.12872-11.42613,2.66876-5.6687,2.861-5.72357,7.60577-2.24528,12.16916,2.2129,2.90325,2.51695,6.83168,4.45862,9.93984-.1998,.25572-.40756,.50344-.6073,.75916-3.66313,4.69837-6.83137,9.74838-9.50223,15.05379,.75484-5.89628-.35959-12.99973-2.25945-17.5787-2.16269-5.21725-6.21632-9.61123-9.78603-14.12153-4.2878-5.41757-13.08034-3.05324-13.83575,3.81439-.00731,.0665-.01443,.13292-.02142,.19942,.53022,.29911,1.04967,.61691,1.55706,.95247,2.89419,1.91408,1.89396,6.40059-1.53532,6.92992l-.07765,.01197c.19179,1.90967,.51938,3.80339,.99876,5.66515-4.57949,17.71009,5.3073,24.16047,19.42432,24.45023,.31164,.15979,.61531,.31957,.92695,.47144-1.4303,4.02707-2.57294,8.15803-3.41986,12.34493-.75907,3.69947-1.28647,7.4389-1.58207,11.19438-.36761,4.73818-.33561,9.50044,.06393,14.23066l-.02398-.16778c-1.01472-5.20962-3.84331-10.07573-7.95036-13.44763-6.11822-5.0259-14.76211-6.87666-21.36259-10.9165-3.17728-1.94467-7.24874,.56838-6.69422,4.25202,.00885,.05879,.01783,.11763,.02699,.17642,.98279,.39945,1.9416,.86294,2.86848,1.38225,.53022,.29918,1.04966,.61691,1.55706,.95247,2.89418,1.91415,1.89395,6.40066-1.53533,6.93l-.07771,.01193c-.05591,.00799-.10388,.01602-.15972,.02405,1.68594,4.00303,4.03503,7.71855,6.97545,10.92265,2.86344,15.46021,15.16196,16.92704,28.31753,12.42488h.00802c1.43825,6.26442,3.5397,12.38496,6.24043,18.21781h22.2928c.07996-.24769,.15184-.50341,.22378-.75113-2.06151,.12793-4.13898,.00803-6.16855-.36745,1.65401-2.02957,3.30796-4.07513,4.96198-6.10463,.03995-.03996,.07195-.07991,.10388-.11987,.83897-1.03867,1.68595-2.06946,2.52491-3.10816l.00045-.00127c.05252-3.18869-.32971-6.36689-1.08711-9.45126l-.00071-.00043Z" fill="#ad40af"/><path d="M667.63772,365.06778c2.55576,.16004,3.96822-3.01527,2.03464-4.86593l-.19236-.76476c.02533-.06125,.05078-.12243,.07643-.18358,2.58461-6.16299,11.34412-6.12047,13.90674,.05167,2.27452,5.4781,5.17037,10.96553,5.8834,16.75771,.31965,2.55684,.17582,5.16164-.39152,7.67061,5.32952-11.64185,8.13413-24.35434,8.13413-37.13874,0-3.21216-.17582-6.42428-.53535-9.6283-.29566-2.62085-.70315-5.22564-1.23055-7.80653-2.85245-13.95104-9.02901-27.23882-17.93812-38.33731-4.2828-2.34119-7.85444-6.00074-10.0118-10.38735-.77504-1.58214-1.38233-3.28404-1.66998-5.0179,.48739,.06393,1.83779-7.3591,1.47018-7.81452,.67924-1.03071,1.89496-1.54307,2.6368-2.54885,3.68944-5.0021,8.77254-4.12872,11.42613,2.66876,5.6687,2.861,5.72357,7.60577,2.24528,12.16916-2.2129,2.90325-2.51695,6.83168-4.45862,9.93984,.1998,.25572,.40756,.50344,.6073,.75916,3.66313,4.69837,6.83137,9.74838,9.50223,15.05379-.75484-5.89628,.35959-12.99973,2.25945-17.5787,2.16269-5.21725,6.21632-9.61123,9.78603-14.12153,4.2878-5.41757,13.08034-3.05324,13.83575,3.81439,.00731,.0665,.01443,.13292,.02142,.19942-.53022,.29911-1.04967,.61691-1.55706,.95247-2.89419,1.91408-1.89396,6.40059,1.53532,6.92992l.07765,.01197c-.19179,1.90967-.51938,3.80339-.99876,5.66515,4.57949,17.71009-5.3073,24.16047-19.42432,24.45023-.31164,.15979-.61531,.31957-.92695,.47144,1.4303,4.02707,2.57294,8.15803,3.41986,12.34493,.75907,3.69947,1.28647,7.4389,1.58207,11.19438,.36761,4.73818,.33561,9.50044-.06393,14.23066l.02398-.16778c1.01472-5.20962,3.84331-10.07573,7.95036-13.44763,6.11822-5.0259,14.76211-6.87666,21.36259-10.9165,3.17728-1.94467,7.24874,.56838,6.69422,4.25202-.00885,.05879-.01783,.11763-.02699,.17642-.98279,.39945-1.9416,.86294-2.86848,1.38225-.53022,.29918-1.04966,.61691-1.55706,.95247-2.89418,1.91415-1.89395,6.40066,1.53533,6.93l.07771,.01193c.05591,.00799,.10388,.01602,.15972,.02405-1.68594,4.00303-4.03503,7.71855-6.97545,10.92265-2.86344,15.46021-15.16196,16.92704-28.31753,12.42488h-.00802c-1.43825,6.26442-3.5397,12.38496-6.24043,18.21781h-22.2928c-.07996-.24769-.15184-.50341-.22378-.75113,2.06151,.12793,4.13898,.00803,6.16855-.36745-1.65401-2.02957-3.30796-4.07513-4.96198-6.10463-.03995-.03996-.07195-.07991-.10388-.11987-.83897-1.03867-1.68595-2.06946-2.52491-3.10816l-.00045-.00127c-.05252-3.18869,.32971-6.36689,1.08711-9.45126l.00071-.00043Z" fill="#ad40af"/><path d="M27.57187,385.09211c0,.66003,.53003,1.19,1.19006,1.19H873.05191c.65997,0,1.19-.52997,1.19-1.19,0-.65997-.53003-1.19-1.19-1.19H28.76193c-.66003,0-1.19006,.53003-1.19006,1.19Z" fill="#3f3d56"/><g><g><path d="M398.80934,195.292c3.32941-2.22513,4.22496-6.72785,2.00008-10.05734-.22398-.33514-.47647-.63869-.74294-.9237l1.48077-65.85792-13.01286,2.02439,.91758,63.87805c-2.21855,2.40541-2.59854,6.09563-.69998,8.93653,2.22488,3.32949,6.72769,4.22489,10.05735,1.99999Z" fill="#ffb6b6"/><path d="M399.37656,84.31574s-.8633,.65246,3.56332,7.39733c3.10373,4.72919,2.67083,38.15711,3.31498,37.72202s-.95566,1.81383-.15575,2.18937-.68314,2.23858-.30089,3.20422c.46571,1.17651-.11317,2.47443-.47896,3.65546-1.0562,3.41022-1.28372,6.33851-2.20218,7.95844,2.19095,1.25745,3.34559,3.87426,2.63975,6.42074l-18.34079-3.31593c-2.23613-3.58222-1.91304-7.34185-.38933-7.99705l-.4537-11.65688-5.22351-38.30777,15.30868-6.83497,2.71837-.43496Z" fill="#e6e6e6"/></g><g><polygon points="369.10009 402.18893 376.94924 402.12276 380.42386 371.14129 368.83925 371.23895 369.10009 402.18893" fill="#ffb6b6"/><path d="M365.52953,418.4277l5.89249-.05124,.05124-.30748,.94791-5.26054,2.59616,5.26054,.13662,.27328,15.60238-.12807c.34156,0,.66608-.05124,.97356-.14522,1.46029-.43554,2.52777-1.8019,2.51073-3.39886-.00855-1.14437-.58925-2.22035-1.53722-2.86939l-12.53654-8.50574-.05124-5.61071-2.69003,.17936-8.36058,.57216-2.04954,.13667-1.46034,19.49651-.02559,.35871Z" fill="#2f2e41"/></g><g><polygon points="260.36854 362.20153 265.80217 367.86626 290.72471 349.13683 282.70518 340.77623 260.36854 362.20153" fill="#ffb6b6"/><path d="M246.11204,370.74401l4.07384,4.25221,4.7399-3.08876-2.15689,5.78768,10.32208,10.76091,.48232,.5031c.24856,.25573,.52211,.46667,.82054,.63282,.47007,.26171,.98758,.40319,1.51012,.43019,.93391,.06059,1.89637-.2637,2.63112-.96891,.8343-.79636,1.22188-1.94899,1.03548-3.08883l-2.41761-14.95166,4.05297-3.89149-1.97164-1.83076-.00747-.00416-6.15115-5.6825-1.50919-1.39731-15.45442,12.53747Z" fill="#2f2e41"/></g><path d="M384.88845,141.67749l14.97908,43.53108,.49464,3.48339c3.77427,3.58363-.96706,4.76423,.81072,5.70928s-1.85071,3.80921,.57764,4.06763c5.17877,.55109-5.4837,171.70389-20.30841,176.85468-3.70258,1.28644-11.46881,3.30902-15.54309,2.67645-6.1889-.96088-7.5329-25.71036-.82953-49.22556,.73218-2.56848-2.93632-5.48591-.54076-8.07701,2.39556-2.5911-.29512-4.29616-.44561-6.4465-.66721-9.5338,5.13779-11.4673,4.8159-23.25094-.71486-26.16939-7-62-7-62,0,0-10.87654,85.22155-15,81-4.12346-4.22155-5.94019,2.71242-7.20024,5.81831-1.053,2.59554-.56022,4.69361-7.16307,4.7718s-42.0636,34.4698-43.63669,34.40989c-3.11656-.11884-14.41346-3.72111-15-9-1-9,12-27,36.23187-48.55408,2.14147-1.90482,4.89245-2.82794,2.23433-8.16352-2.65813-5.33559,10.56764-39.85916,9.4327-41.45585-3.01244-4.23804-4.15956-6.08022-1.18871-6.35778,2.97085-.27756,3.8486,1.35214,4.00905-2.75899,.16045-4.11113,.67328-14.24884,.67328-14.24884,.71075-46.5878,2.29663-49.58887,17.22144-62.24506l1.28515-13.16153,41.09033-7.37686Z" fill="#2f2e41"/><path d="M396.11095,139.93755c.44152,.06288,2.142,.39846-.11141,.93021-2.24657,.53242-.14695,1.2323-.14695,1.2323-.73542,.48937-1.47698,.99377-2.21855,1.50432-7.75468,5.34749,9.23098,25.94461,1.23845,31.16565-11.24722,7.33502-43.18556-6.05042-50.85617-11.53733-.40598-.28706-.79761-.60214-1.18309-.94524v-.00683c-.21666-.18932-.434-.39231-.65067-.60897,0,0-2.7816-7.27159-1.53257-6.47162s1.2337-1.06304,.24136-2.63154-1.40757-4.09647,.30004-2.83248,3.44577-10.30158,4.59206-11.67459c.76959-.91654,1.03546-1.4558,1.03546-1.75652,0-.66502-1.30885-.1818-1.30885-.1818,0,0-1.74969-.36429-.20299-1.39292,1.55422-1.02863-2.52611-17.69988-2.52611-17.69988l-2.01556-14.17248c-2.21172-6.59961-4.50067-15.09654-.48321-19.07161l20.57662-10.97383,20.99627-.69988,16.51679,8.8742c6.40345,3.26153,4.47196,18.1831,1.86178,24.88728,0,0-3.53424,33.39856-3.95457,32.71235-.42649-.68552-.60146,1.28766-.16813,1.35122Z" fill="#e6e6e6"/><path d="M391.23645,43.51426c-.19919,2.3906-.38937,4.78115-.57949,7.17175-.22638,2.78904-.45276,5.60521-1.16816,8.31272-.19013,.74254-.43463,1.5032-.95079,2.07369-.8512,.96892,.72441,6.63747-.4437,7.18081-1.28583,.60669-2.54453,.93266-3.76696,1.05945-.05433-.39843-.12679-.79687-.20831-1.18624-.00906-.04527-.01807-.08152-.02714-.12679-.3713-1.75672-1.05044-3.45912-2.01936-4.98039,.23545,1.80199,.01813,3.6493-.58856,5.36075-.09959,.28071-.21732,.56142-.3441,.84213-5.13432-.76067-9.58048-4.22885-13.08486-4.19259-2.12796-7.13555-3.63117-14.46128-4.48236-21.85035-.22638-1.97404-.35311-4.16545,.86026-5.73199,1.07758-1.39449,2.91582-1.90158,4.63629-2.27288,5.61427-1.21337,11.3734-1.76579,17.11446-1.639l-9.95172-2.31814c2.79804-.01813,5.64141-.02714,8.31272,.7878,2.67131,.80593,5.19771,2.57172,6.23002,5.17057,.7878,1.9831,.62482,4.21066,.46177,6.33868Z" fill="#2f2e41"/><circle cx="369.12721" cy="44.9426" r="20.2656" fill="#ffb6b6"/><path d="M389.68804,77.0846c-7.64264-6.796,5.38789-26.20733-4.79027-39.16196l-1.22244-.915c-.70628,1.6964-2.5264,3.09466-4.23785,3.91722-.38937-1.77873-1.02325-3.49571-1.89257-5.04821,.22638,1.9535,.03626,3.95838-.5161,5.82961-.57049,.07191-.97798-.01029-1.1229-.26733,.18112,1.57302-4.62722,2.35442-3.6221-.09256,.00906-.03081,.01813-.05139,.02719-.07198-1.24057,2.49838-3.79416,3.66018-6.01271,5.04821-2.21855,1.37768-4.4733,3.6807-4.25598,6.53897,.18112,2.31332,1.9469,4.04059,3.72175,5.19211,1.7748,1.16181,3.76696,2.06658,5.0528,3.86582,2.16422,3.02274,1.65713,7.45403,.56142,11.1348-.33504,1.14122-1.34922,1.95343-2.68032,2.40582-.3713-1.9946-1.05044-3.92751-2.01936-5.65478,.23545,2.04599,.01813,4.14344-.58856,6.08665-2.58078,.05139-5.46941-.84308-7.18988-2.71431l1.36735,6.066c-2.20042-.46261-4.41897,.06169-6.65565,.46268-.05433-.67855-.15392-1.36745-.28071-2.04599-.36218-2.04599-1.05039-4.0303-2.0465-5.79874,.28977,2.50867-.09959,5.07902-1.05945,7.37182-.10866,.26726-.22638,.53459-.35317,.79163-3.44099-.24674-6.87291-2.25163-6.22096-7.46432,.21732-1.72727,1.06851-3.22832,2.02837-4.58547,1.77485-2.48815-7.27134-5.151-6.71899-8.15316,.82406-4.45187,9.07339-8.38967,8.42138-12.88265-.57949-4.07147-.46592-13.26203,1.77485-16.42968,3.23721-4.57629-.3538-14.04342,22.65628-8.66724,8.56008,2.00002,11.52733-6.39695,24.43107,19.24491,2.21231,4.39622-5.83153,2.88492-1.10472,12.30877,4.72682,9.42385-8.81081,16.89237-5.45128,23.68837Z" fill="#2f2e41"/><g><path d="M349.65016,32.91987c.04552,.01722,.08534,.03438,.13087,.0516,.0853,.04008,.17635,.06878,.26738,.09747,.57461,.21215,1.17788,.35033,1.80413,.41458,.25615,.02911,.52378,.04116,.7914,.04183,.34169,.00086,.6834-.02104,1.0138-.06577,.37593-.04458,.74629-.12337,1.1053-.22496,.17094-.04513,.34191-.10163,.50723-.16388,2.2855-.80853,4.07827-2.6604,4.80735-4.98188v-.0057c.04015-.1081,.06892-.22762,.09767-.34141,.16671-.62599,.25381-1.28632,.25553-1.96396l.00003-.0114c.00151-.59791-.06535-1.17893-.19488-1.743-.23094-1.00852-.65565-1.94916-1.2458-2.76496-.56741-.80438-1.22286-.9388-.85517-1.85857,1.17291-2.93402-3.62578-5.33244-6.4587-4.04234-.10247-.01166-.20496-.01192-.30749-.01218-1.90763-.00483-2.61516,2.81216-3.75237,4.39804l.03292,.01073c1.31869,.43231,1.30089,2.33943-.0186,2.76929-.75721,.24668-1.52313,.46458-2.29514,.65371-2.54907,3.01055,.37314,11.8181,4.31455,9.74277Z" fill="#2f2e41"/><path d="M358.76709,20.49748c.28015,5.40411-2.96625,10.78283-7.90127,13.01872-.9941,.45039-1.85965-1.02369-.8585-1.47728,4.4298-2.00699,7.30354-6.68252,7.05143-11.54576-.05696-1.09871,1.65155-1.09106,1.70834,.00432h0Z" fill="#ad40af"/></g><path d="M370.66754,131.14031c1.45568,.09115,2.26017-1.7174,1.15886-2.77147l-.10956-.43559,.04353-.10456c1.47211-3.51024,6.46124-3.48602,7.92082,.02943,1.29549,3.12015,2.94488,6.24561,3.35099,9.54465,.18206,1.4563,.10014,2.9399-.223,4.36893,3.03552-6.63082,4.63294-13.87144,4.63294-21.15302,0-1.82954-.10014-3.65906-.30492-5.48396-.1684-1.49275-.40049-2.97635-.70088-4.44634-1.62466-7.94606-5.14263-15.51434-10.21697-21.83568-2.43935-1.33347-4.47363-3.41783-5.7024-5.91629-.44144-.90114-.78733-1.87048-.95117-2.85804,.2776,.03641,1.04674-4.1915,.83737-4.4509,.38687-.58706,1.07931-.87888,1.50184-1.45174,2.10138-2.84903,4.99655-2.35158,6.50795,1.52004,3.2287,1.62953,3.25996,4.332,1.27884,6.93116-1.2604,1.6536-1.43358,3.8911-2.53948,5.66141,.1138,.14565,.23213,.28674,.3459,.43239,2.0864,2.67604,3.89093,5.55236,5.41216,8.57415-.42993-3.35833,.20481-7.40422,1.28691-10.01226,1.2318-2.97158,3.54061-5.47424,5.5738-8.04316,2.44219-3.08567,7.45013-1.73902,7.88039,2.17255l.0122,.11358c-.302,.17036-.59786,.35137-.88685,.54249-1.64843,1.0902-1.07874,3.64557,.87447,3.94706l.04423,.00682c-.10924,1.08769-.29582,2.16629-.56886,3.22669,2.60833,10.08709-3.02287,13.76102-11.06346,13.92605-.1775,.09101-.35046,.18202-.52796,.26852,.81465,2.29369,1.46547,4.64655,1.94784,7.03127,.43234,2.1071,.73273,4.23696,.9011,6.37596,.20938,2.69871,.19115,5.41114-.03641,8.10532l.01366-.09556c.57795-2.96723,2.18903-5.73881,4.52827-7.65934,3.48474-2.86259,8.40802-3.91672,12.16743-6.21768,1.80968-1.10762,4.12865,.32373,3.81281,2.42181l-.01537,.10048c-.55977,.22751-1.10587,.4915-1.63379,.78729-.302,.1704-.59785,.35137-.88685,.54249-1.64843,1.09024-1.07873,3.64561,.87448,3.9471l.04426,.0068c.03185,.00455,.05916,.00912,.09097,.0137-.96026,2.27999-2.29822,4.39624-3.97299,6.22118-1.63092,8.80563-8.63576,9.64109-16.12875,7.0768h-.00457c-.81918,3.56801-2.0161,7.05407-3.55435,10.37627h-12.69725c-.04554-.14108-.08648-.28672-.12746-.42782,1.17417,.07287,2.35743,.00457,3.51341-.20929-.94207-1.15598-1.88411-2.32106-2.82618-3.477-.02275-.02276-.04098-.04552-.05917-.06827-.47785-.59159-.96026-1.1787-1.43811-1.77031l-.00025-.00072c-.02991-1.81617,.18779-3.62637,.61918-5.38313l.0004-.00025Z" fill="#ad40af"/><g><path d="M358.08694,98.27969s-15.31764-16.27823-16.09714-8.39851c-.50725,5.12767-5.5962,31.84852-2.67753,41.00649,1.45347,4.56057,6.50046,6.8954,10.9211,5.05983l36.68683-15.23339-4.82822-9.89505-29.05808,12.02493,5.05303-24.56431Z" fill="#ffb6b6"/><circle cx="387.48195" cy="112.9773" r="7.69863" fill="#ffb6b6"/></g><path d="M351.14609,87.72753l-10.86389-3.94134c-4.74796,12.48645-9.0038,38.03679-6.69349,37.6253s.91942,2.6164,.11487,3.10245,1.25519,2.97345,.22532,3.22975,.23672,2.46747,.39032,3.70198c0,0,5.599,8.39853,11.19801,8.39853s11.07677-3.26827,11.07677-3.26827l6.07341,.60653-1.84109-24.20517-5.81944,6.12306,5.27742-22.47701-9.13821-8.89582Z" fill="#e6e6e6"/></g></svg>`}
            width={300}
            height={300}
            style={{ transform: [{ rotate: "-5deg" }] }}
          />
        </View>

        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Đăng nhập
        </Text>

        <InputField
          label={"Email hoặc username"}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
          inputType={"text"}
          fieldButtonLabel={""}
          fieldButtonFunction={() => {}}
          onTextChange={(text: string) => setEmail(text)}
        />

        <InputField
          label={"Mật khẩu"}
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
          fieldButtonLabel={"quên mật khẩu?"}
          fieldButtonFunction={() => {
            navigation.navigate("ForgotPassword" as never);
          }}
          keyboardType={"email-address"}
          onTextChange={(text: string) => setPassword(text)}
        />

        <Button
          title={"Đăng nhập"}
          type={"medium"}
          onPress={function (): void {
            handleLogin();
          }}
          theme={{
            ...currentTheme,
            primary: "#FFFFFF",
            width: Layout.window.width / 2,
            backgroundColor: currentTheme.button_primary,
            text: "#FFFFFF",
            alignSelf: "center",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text>Là người mới?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "#1A73E8", fontWeight: "700" }}>
              {" "}
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
