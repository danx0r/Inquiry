<?php

/** JSonQuery */
/** Simple query interface for json */

//TODO passare anche la query (...query:{})

class jsq {

	/** the json file to work with */
	public $url;
	/** the query to perform - as object */
	public $query;
	/** the json content */
	public $json;
	/** for internal executions */


	/** constructor */
	function __construct( $url ) {
		$this->url = $url;
		$this->init_file();
		return $this;
	}

	/** init the file */
	function init_file() {

		$this->json = file_get_contents($this->url);
		$this->json = json_decode($this->json);
		
	}

	public function find($query) {

		// if $query is a string convert in object
		if(is_string($query))
			$query = $this->parse($query);

		$this->query = $query;
		
		$valid = array();

		foreach($this->json as $object) {	
			$val = true;
			foreach($this->query as $n=>$v) {
				if($this->check($n,$v,$object) == false) {
					$val = false;
					break;
				}
			}

			if($val) $valid[]=$object;

		}
		
		return $valid;

	}

	function check($query, $value, $o) {


		switch($query) {
			
			// or operator
			case '$or' :

			foreach($value as $a) {

				foreach($a as $q=>$v) {
					if($this->check($q,$v,$o) === true)
						return true;
				}

			}
			
			return false;
			break;
			
			default :
			// check for comparison operators...
			if (is_object($value)) {

				foreach($value as $op=>$v) {
					$valid = true;
				
				switch($op) {

					// greater than...
					case '$gt' :
						$valid = $o->$query > $v;
						
					break;

					// greater than or equal to...
					case '$gte' :
						$valid = $o->$query >= $v || strpos(strtolower($o->$query), strtolower($v)) !== false;
					break;

					// less than...
					case '$lt' :
						$valid = $o->$query < $v;
					break;

					// less than or equal to...
					case '$lte' :
						$valid = $o->$query <= $v || strpos(strtolower($o->$query), strtolower($v)) !== false;;
					break;
					
					// not equal to...
					case '$ne' :
						$valid = !$this->check($query, $v, $o);
						
					break;

				}
				
					if (!$valid) return $valid;
				
				} return $valid;

				} else if ($value == "null" ) {
					return strpos(strtolower($o->$query), "null") !== false || strpos(strtolower($o->$query), "unknown") !== false || $o->$query == "";
				} else if ($value == "") return true;
				
					else return strpos(strtolower($o->$query), strtolower($value)) !== false; 
				
				break;
			}
			//return true;
		}



		/** parse a string into a json object*/
		function parse($string) {

			return json_decode($string);

		}
	}


	?>