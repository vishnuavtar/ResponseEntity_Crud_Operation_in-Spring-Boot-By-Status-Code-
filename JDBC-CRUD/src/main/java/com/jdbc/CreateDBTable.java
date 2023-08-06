package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

// working

public class CreateDBTable {

	public static void main(String[] args) throws Exception  {
		
	    
		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");
		 
	    String str = "create table student(id int primary key , name varchar(100), city varchar(100))";
	    
	    Statement st = con.createStatement();
	    
	    
	    st.execute(str);
	    
	    System.out.println("done");
	    
	    
	}

}
