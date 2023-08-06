package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.Scanner;

// working

public class DeleteDBDATA {

	public static void main(String[] args) throws Exception {

		Class.forName("com.mysql.cj.jdbc.Driver");

		Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/abc", "root", "root");

		String str = "delete from student where id = ?";

		Scanner sc = new Scanner(System.in);

		System.out.println("Enter id for delete");

		int id1 = sc.nextInt();

		PreparedStatement ps = con.prepareStatement(str);

		ps.setInt(1, id1);

		ps.executeUpdate(); // insert , update, delete

		System.out.println("deleted");

		con.close();

	}

}
