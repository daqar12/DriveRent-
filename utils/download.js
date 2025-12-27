// utils/download.js
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// PDF download - Quruxda badan
export const downloadPDF = (booking) => {
  const doc = new jsPDF();
  
  // Midabada PDF
  const primaryColor = [41, 128, 185];   // Midab buluug ah
  const secondaryColor = [52, 152, 219]; // Midab buluug khafiif ah
  const accentColor = [230, 126, 34];    // Midab jaale ah
  const darkColor = [44, 62, 80];        // Midab madow
  const lightColor = [236, 240, 241];    // Midab caddaan
  
  // Mugga ugu sareeya (Header)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Magaca Shirkadda (Header)
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("DriveRent Car Rental", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Your Journey, Our Responsibility", 105, 28, { align: "center" });
  
  // Mugga Bookiga (Booking Card)
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, 45, 170, 25, 5, 5, 'F');
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, 45, 170, 25, 5, 5, 'S');
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BOOKING CONFIRMATION", 105, 57, { align: "center" });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  
  // Mugga Macaamiisha (Customer Info)
  const startY = 80;
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CUSTOMER INFORMATION", 20, startY);
  
  doc.setDrawColor(220, 220, 220);
  doc.line(20, startY + 2, 80, startY + 2);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  
  let y = startY + 10;
  doc.text(`Full Name: ${booking.userName}`, 25, y);
  y += 7;
  doc.text(`Email: ${booking.userEmail}`, 25, y);
  y += 7;
  doc.text(`Phone: ${booking.userPhone || 'Not provided'}`, 25, y);
  
  // Mugga Gaariga (Car Info) - Quruxda badan
  const carY = startY + 35;
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CAR DETAILS", 20, carY);
  
  doc.setDrawColor(...accentColor);
  doc.line(20, carY + 2, 55, carY + 2);
  
  // Mugga gaariga (Car box)
  doc.setFillColor(255, 248, 220); // Background jaale khafiif
  doc.roundedRect(20, carY + 10, 170, 40, 5, 5, 'F');
  doc.setDrawColor(255, 193, 7);
  doc.setLineWidth(0.8);
  doc.roundedRect(20, carY + 10, 170, 40, 5, 5, 'S');
  
  y = carY + 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text(`${booking.carBrand} ${booking.carModel}`, 30, y);
  
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  y += 8;
  doc.text(`Car Name: ${booking.carName}`, 30, y);
  
  y += 7;
  doc.text(`Year: ${booking.carYear || '2023'} | Color: ${booking.carColor || 'Silver'}`, 30, y);
  
  y += 7;
  doc.text(`Plate: ${booking.carPlate || 'ABC-123'}`, 30, y);
  
  // Mugga Waqtiga (Booking Dates)
  const dateY = carY + 60;
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BOOKING DATES & LOCATIONS", 20, dateY);
  
  doc.setDrawColor(...secondaryColor);
  doc.line(20, dateY + 2, 110, dateY + 2);
  
  // Mugga waqtiga (Date boxes)
  y = dateY + 15;
  
  // Pickup
  doc.setFillColor(225, 245, 254);
  doc.roundedRect(20, y, 85, 25, 3, 3, 'F');
  doc.setDrawColor(...secondaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, y, 85, 25, 3, 3, 'S');
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...secondaryColor);
  doc.text("PICKUP", 25, y + 8);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`${booking.pickupDate}`, 25, y + 15);
  doc.text(`${booking.pickupLocation}`, 25, y + 20);
  
  // Return
  doc.setFillColor(232, 245, 233);
  doc.roundedRect(115, y, 75, 25, 3, 3, 'F');
  doc.setDrawColor(76, 175, 80);
  doc.setLineWidth(0.5);
  doc.roundedRect(115, y, 75, 25, 3, 3, 'S');
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(76, 175, 80);
  doc.text("RETURN", 120, y + 8);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`${booking.dropoffDate}`, 120, y + 15);
  doc.text(`${booking.returnLocation}`, 120, y + 20);
  
  // Mugga Lacagta (Payment Info)
  const paymentY = dateY + 55;
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT SUMMARY", 20, paymentY);
  
  doc.setDrawColor(156, 39, 176);
  doc.line(20, paymentY + 2, 75, paymentY + 2);
  
  y = paymentY + 15;
  
  // Mugga lacagta (Payment box)
  doc.setFillColor(243, 229, 245);
  doc.roundedRect(20, y, 170, 35, 5, 5, 'F');
  doc.setDrawColor(156, 39, 176);
  doc.setLineWidth(0.8);
  doc.roundedRect(20, y, 170, 35, 5, 5, 'S');
  
  // Heerka (Status indicators)
  const statusColor = booking.status === 'Confirmed' ? [46, 204, 113] : 
                     booking.status === 'Pending' ? [241, 196, 15] : 
                     [231, 76, 60];
  
  const paymentStatusColor = booking.paymentStatus === 'Paid' ? [46, 204, 113] : 
                           booking.paymentStatus === 'Pending' ? [241, 196, 15] : 
                           [231, 76, 60];
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkColor);
  doc.text(`Total Price:`, 30, y + 12);
  
  doc.setFontSize(16);
  doc.setTextColor(231, 76, 60);
  doc.text(`$${booking.totalPrice}`, 75, y + 12);
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Status:`, 30, y + 22);
  doc.text(`Payment:`, 30, y + 29);
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...statusColor);
  doc.text(`${booking.status}`, 55, y + 22);
  
  doc.setTextColor(...paymentStatusColor);
  doc.text(`${booking.paymentStatus}`, 55, y + 29);
  
  // Footer
  const footerY = paymentY + 65;
  doc.setFillColor(...darkColor);
  doc.rect(0, footerY, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing DriveRent Car Rental!", 105, footerY + 8, { align: "center" });
  doc.text("For inquiries: support@driverent.com | Phone: +1-234-567-890", 105, footerY + 14, { align: "center" });
  
  // Download PDF
  doc.save(`DriveRent_Booking_${booking.bookingId}.pdf`);
};

// Excel download (Halkan waxaan ku darsanaynaa quruxda Excel-ka sidoo kale)
export const downloadExcel = (booking) => {
  // Formatting for Excel
  const formattedBooking = {
    "Customer Name": booking.userName,
    "Email": booking.userEmail,
    "Phone": booking.userPhone || "N/A",
    "Car Brand": booking.carBrand,
    "Car Model": booking.carModel,
    "Car Name": booking.carName,
    "Pickup Date": booking.pickupDate,
    "Return Date": booking.dropoffDate,
    "Pickup Location": booking.pickupLocation,
    "Return Location": booking.returnLocation,
    "Total Price": `$${booking.totalPrice}`,
    "Booking Status": booking.status,
    "Payment Status": booking.paymentStatus,
    "Generated Date": new Date().toLocaleDateString()
  };
  
  const worksheet = XLSX.utils.json_to_sheet([formattedBooking]);
  const workbook = XLSX.utils.book_new();
  
  // Excel formatting
  const wscols = [
    {wch: 15}, // Booking ID
    {wch: 20}, // Customer Name
    {wch: 25}, // Email
    {wch: 15}, // Phone
    {wch: 15}, // Car Brand
    {wch: 20}, // Car Model
    {wch: 20}, // Car Name
    {wch: 12}, // Pickup Date
    {wch: 12}, // Return Date
    {wch: 20}, // Pickup Location
    {wch: 20}, // Return Location
    {wch: 12}, // Total Price
    {wch: 15}, // Booking Status
    {wch: 15}, // Payment Status
    {wch: 15}  // Generated Date
  ];
  
  worksheet["!cols"] = wscols;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, "Booking Details");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });
  
  saveAs(data, `DriveRent_Booking_${booking.bookingId}.xlsx`);
};