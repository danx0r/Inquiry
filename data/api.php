<?php

/** */

// perform a query and returns a json object with the result
if (!isset($_REQUEST["action"])) {
	throw_error("Missing action");
	die();
}

$action = $_REQUEST["action"];

$url = "letters.json";

// there are two possible kinds of action
switch ($action) {
	
	// 'stats' returns an overview of the json file
	// i.e. the number of total objects, the fields...
	case "stats" :

	throw_result(get_stats($url));

	break;

	// 'query' performs a query passed as a mongo db query
	case "query" :
	
	$q = $_REQUEST["q"];
	$q = stripslashes($q);
	include('jsq.class.php');
	
	$j = new jsq($url);
	throw_result($j->find($q));

break;

default :
throw_error("Wrong action");
die();		
break;

}

function throw_error($msg) {

	$error = array();
	$error["status"] = "error";
	$error["code"] = $msg;
	print_r(json_encode($error));

}

function throw_result($msg) {

	$result = array();
	$result["status"] = "ok";
	$result["result"] = $msg;
	print_r((json_encode($result)));

}

function get_stats($url) {

	$json = file_get_contents($url);
	$json = json_decode($json);

	$properties = array();

	foreach($json[0] as $k=>$v) {
		$properties[$k] = array();
		$properties[$k]["min"] = $v;
		$properties[$k]["max"] = $v;
		$properties[$k]["null"] = 0;
	}

	foreach($json as $o) {

		foreach($o as $k=>$v) {

			if (strpos(strtolower($v), "null") !== false || strpos(strtolower($v), "unknown") !== false|| $v == "" )
				$properties[$k]["null"]++;
			else {

				if ($v < $properties[$k]["min"])
					$properties[$k]["min"] = $v;
				if ($v > $properties[$k]["max"])
					$properties[$k]["max"] = $v;
			}
		}

	}
	
	$stats = array();
	$stats["properties"] = $properties;
	$stats["objects"] = count($json);

	return $stats;
}



?>

