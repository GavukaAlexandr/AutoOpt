import 'package:flutter/material.dart';

class OrderCarParts extends StatefulWidget {
  const OrderCarParts({Key? key}) : super(key: key);

  @override
  _OrderCarPartsState createState() => _OrderCarPartsState();
}

class _OrderCarPartsState extends State<OrderCarParts> {
  String dropdownValue = 'One';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Поиск запчастей'),
          centerTitle: true,
          actions: [
            IconButton(
              onPressed: () {
                Navigator.pushNamed(context, 'userProfile');
              },
              icon: Icon(Icons.person),
              iconSize: 36,
            )
          ],
          backgroundColor: Colors.blueAccent,
        ),
        body: SafeArea(
            child: Row(
          children: [
            Column(
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 20, right: 20),
                  child: Container(
                    width: (320),
                    child: DropdownButton<String>(
                      value: dropdownValue,
                      hint: Container(
                        width: 290, //and here
                        child: Text(
                          "Select Item Type",
                          style: TextStyle(color: Colors.grey),
                          textAlign: TextAlign.end,
                        ),
                      ),
                      underline: Container(
                        height: 2,
                        color: Colors.blueAccent,
                      ),
                      onChanged: (String? newValue) {
                        setState(() {
                          dropdownValue = newValue!;
                        });
                      },
                      items: <String>['One', 'Two', 'Free', 'Four']
                          .map<DropdownMenuItem<String>>((String value) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        );
                      }).toList(),
                    ),
                  ),
                )
              ],
            )
          ],
        )));
  }
}
