<?php
$to='deep03dey@gmail.com';$site='German With Deep';$from='noreply@germanwithdeep.com';
if($_SERVER['REQUEST_METHOD']!=='POST'){header('Location:contact.html');exit;}
function cl($v){return htmlspecialchars(strip_tags(trim($v)),ENT_QUOTES,'UTF-8');}
$fn=cl($_POST['firstName']??'');$ln=cl($_POST['lastName']??'');
$em=filter_var(trim($_POST['email']??''),FILTER_SANITIZE_EMAIL);
$ph=cl($_POST['phone']??'');$lv=cl($_POST['level']??'');
$md=cl($_POST['mode']??'');$msg=cl($_POST['message']??'');
$err=[];
if(empty($fn))$err[]='First name required.';
if(!filter_var($em,FILTER_VALIDATE_EMAIL))$err[]='Valid email required.';
if(empty($ph))$err[]='Phone required.';
if(empty($lv))$err[]='Please select a level.';
if(!empty($err)){echo '<ul>';foreach($err as $e)echo "<li>$e</li>";echo '</ul><a href="contact.html">Back</a>';exit;}
$name="$fn".($ln?" $ln":'');
$subj="New Demo Request – German $lv ($name)";
$body="From: $name\nEmail: $em\nPhone: $ph\nLevel: $lv\nMode: ".($md?:'N/A')."\nMessage: ".($msg?:'None')."\n\n---\ngermanwithdeep.com";
$hdrs="From:$site <$from>\r\nReply-To:$name <$em>\r\nContent-Type:text/plain;charset=UTF-8\r\n";
$conf="Dear $fn,\n\nThank you for applying at German With Deep!\n\nLevel: $lv\nYour Phone: $ph\n\nWe'll contact you within 24 hours to schedule your free demo.\n\nWhatsApp: +91 70112 33319\n\nLos gehts! 🎉\nDeep Dey\nGerman With Deep\nA-47, Vasant Vihar, New Delhi – 110057";
$ch="From:$site <$from>\r\nContent-Type:text/plain;charset=UTF-8\r\n";
$ok=mail($to,$subj,$body,$hdrs);
if($ok)mail($em,"Demo Application Received – $site",$conf,$ch);
header($ok?'Location:contact.html?sent=1':'Location:contact.html?error=1');exit;
?>
