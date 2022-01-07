<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$marketId = $request->marketId;
$selectionId = $request->selectionId;

// $marketId=$_POST['marketId'];
// echo $marketId;
// $selectionId=$_POST['selectionId'];
// echo $selectionId;

$postFieldData="marketId=".$marketId."&selectionId=".$selectionId;
// echo $postFieldData;
$curl = curl_init();


curl_setopt_array($curl, array(
  CURLOPT_URL => "https://www.skyexch.com/exchange/mobile/member/mobilePlayerService/queryMarketDepth",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  // CURLOPT_POSTFIELDS => "marketId=1.155172463&selectionId=448",
  // CURLOPT_POSTFIELDS => "marketId="+$marketId+"&selectionId="+$selectionId,
  CURLOPT_POSTFIELDS => $postFieldData,
  CURLOPT_HTTPHEADER => array(
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}

?>