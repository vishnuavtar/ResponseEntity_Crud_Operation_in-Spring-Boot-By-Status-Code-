package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.Scanner;

// working

public class Delete {
	
	
	public static void main(String[] args) throws Exception {
		
		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");
		
		
		String delete = "delete from demo1 where id=?";
		
		Scanner sc = new Scanner(System.in);
		
		System.out.println("Enter id for delete");
		
		int deleteid = sc.nextInt();
		
		PreparedStatement ps = con.prepareStatement(delete);
		
		ps.setInt(1, deleteid);
		
		ps.execute();
		
		System.out.println("done");
		
		
	}

}
