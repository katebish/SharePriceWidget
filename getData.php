<?php

	try{
		$con = new PDO("mysql:host=localhost;dbname=ass2comp333",'root','');
	   	}
	catch (PDOException $e) {
		echo "Database connection error " . $e->getMessage();
		}
	$company = $_POST['comp'];

	$stmt = $con->prepare('SELECT `Price`, `Change` FROM `shareprices` WHERE `Name`=:name');
	$stmt->bindvalue('name', $company);
	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$stmt->execute();
	
	$res = $stmt->fetch();
	
	$myJSON = json_encode($res);
	echo $myJSON;
	die();
	

?>

