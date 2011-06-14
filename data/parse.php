<?php

	$url = "new_letters.txt";
	

	if (($handle = fopen($url, "r")) !== FALSE) {
		
		$rows = array();
		$header = fgetcsv($handle, 1000, ",");
		
		$header = explode("\t",$header[0]);
		
	    while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
	       	$c=0;
			$row = array();
			//print_r($data);
			foreach ($header as $key) {
	            $row[$key] = utf8_decode(str_replace('"',"'",$data[$c]));
	        	$c++;
			}
	   	$rows[] = $row;
	 	}
	    fclose($handle);
	}
	
	print_r(json_encode($rows));
	

	

?>