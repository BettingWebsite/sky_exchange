<?php 
session_start(); 
$text = rand(1000,9999); 
$_SESSION["vercode"] = $text; 
$height = 15; 
$width = 45;
  
$image_p = imagecreate($width, $height); 
$black = imagecolorallocate($image_p, 255, 255, 255); 
$white = imagecolorallocate($image_p, 0, 0, 0); 
$font_size = 50; 
// $font_weigth = 'bolder';
// $font_file  ='./MonospaceBold.ttf';
// $fontWeight = 'bolder';


imagettftext($image_p, 0, 0, $text_color,$text, $white);

  
imagestring($image_p, $font_size, 0, 0, $text, $white); 


// imagettftext($image_p, $text_color, 0, 0, $text,  $white);


imagejpeg($image_p, null, 80); 


// session_start();

// $strings = '123456789';
// $i = 0;
// $characters = 6;
// $code = '';
// while ($i < $characters)
// { 
//     $code .= substr($strings, mt_rand(0, strlen($strings)-1), 1);
//     $i++;
// } 

// $_SESSION['vercode'] = $code;

// //generate image
// $im = imagecreatetruecolor(124, 40);
// $foreground = imagecolorallocate($im, 0, 0, 0);
// $shadow = imagecolorallocate($im, 173, 172, 168);
// $background = imagecolorallocate($im, 255, 255, 255);

// imagefilledrectangle($im, 0, 0, 200, 200, $background);

// // use your own font!
// $font = 'monofont.ttf';

// //draw text:
// imagettftext($im, 35, 0, 9, 28, $shadow, $font, $code);
// imagettftext($im, 35, 0, 2, 32, $foreground, $font, $code);     

// // prevent client side  caching
// header("Expires: Wed, 1 Jan 2022 00:00:00 GMT");
// header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// header("Cache-Control: no-store, no-cache, must-revalidate");
// header("Cache-Control: post-check=0, pre-check=0", false);
// header("Pragma: no-cache");

// //send image to browser
// header ("Content-type: image/png");
// imagepng($im);
// imagedestroy($im);
?>


