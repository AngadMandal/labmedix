import { PrismaClient, AppointmentStatus, LabOrderStatus, PaymentStatus, ReportVisibility } from "@prisma/client";

const prisma = new PrismaClient();

const doctors = [
  {
    slug: "dr-ashok-mandal",
    fullName: "Dr. Ashok Mandal",
    specialty: "General Physician",
    registrationNo: "WBMC 92805",
    bio: "M.B.B.S. Cal (WBMC), Ex-HP (Paediatrics & Chest).",
    availability: "Mon, Wed, Fri | 10:00 AM - 2:00 PM",
    consultationFee: 400
  },
  {
    slug: "dr-chinmay-mandal",
    fullName: "Dr. Chinmay Mandal",
    specialty: "General Medicine",
    registrationNo: "Clinic registration active",
    bio: "M.B.B.S. (Cal), (WBUHS), Ex-HP Cardiology Dept.",
    availability: "Tue, Thu, Sat | 11:00 AM - 4:00 PM",
    consultationFee: 450
  },
  {
    slug: "dr-debabrata-mandal",
    fullName: "Dr. Debabrata Mandal",
    specialty: "Gastro & Liver Specialist",
    registrationNo: "WBMC 98605",
    bio: "Ex House Physician Gastroenterology, Critical Care RMO.",
    availability: "Mon to Sat | 2:30 PM - 6:30 PM",
    consultationFee: 700
  },
  {
    slug: "dr-biplob-mandal",
    fullName: "Dr. Biplob Mandal",
    specialty: "Gynaecology",
    registrationNo: "WBMC 86511",
    bio: "M.B.B.S., MS (Obstetrics & Gynaecology).",
    availability: "Tue, Thu, Sun | 9:30 AM - 1:30 PM",
    consultationFee: 650
  },
  {
    slug: "dr-ismail-saikh",
    fullName: "Dr. Ismail Saikh",
    specialty: "Physiotherapy",
    registrationNo: "TNU-2020042100046",
    bio: "BPT (Kol), chronic pain and rehabilitation support.",
    availability: "Daily | 8:00 AM - 12:00 PM",
    consultationFee: 500
  }
];

const services = [
  {
    slug: "general-opd-consultation",
    name: "General OPD Consultation",
    category: "OPD",
    description: "Routine physician consultations, follow-up care, and chronic disease review.",
    price: 400,
    isPackage: false
  },
  {
    slug: "gastro-liver-consultation",
    name: "Gastro & Liver Consultation",
    category: "OPD",
    description: "Specialized consultation for digestive and liver-related conditions.",
    price: 700,
    isPackage: false
  },
  {
    slug: "complete-blood-count",
    name: "Complete Blood Count",
    category: "LAB",
    description: "Routine hematology screening for infection, anemia, and overall health.",
    price: 350,
    turnaroundTime: "6 hours",
    isPackage: false,
    specimen: "Whole blood",
    preparation: "No preparation required"
  },
  {
    slug: "thyroid-profile",
    name: "Thyroid Profile",
    category: "LAB",
    description: "TSH, T3, and T4 profile for thyroid function monitoring.",
    price: 850,
    turnaroundTime: "12 hours",
    isPackage: false,
    specimen: "Serum",
    preparation: "Morning sample preferred"
  },
  {
    slug: "diabetes-monitoring-package",
    name: "Diabetes Monitoring Package",
    category: "PACKAGE",
    description: "Sugar profile, HbA1c, kidney function, and physician-ready summary.",
    price: 1350,
    turnaroundTime: "24 hours",
    isPackage: true,
    specimen: "Blood and urine",
    preparation: "8-hour fasting advised"
  },
  {
    slug: "preventive-wellness-package",
    name: "Preventive Wellness Package",
    category: "PACKAGE",
    description: "A bundled annual health package with pathology, sugar, lipid, and thyroid review.",
    price: 2499,
    turnaroundTime: "24 hours",
    isPackage: true,
    specimen: "Blood and urine",
    preparation: "8-hour fasting advised"
  }
];

async function main() {
  await prisma.report.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.labOrder.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.labTest.deleteMany();
  await prisma.service.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.branch.deleteMany();

  const branch = await prisma.branch.create({
    data: {
      name: "LabMedix Main Branch",
      code: "LXM-01",
      phone: "+91 89720 25390",
      email: "care@labmedix.in",
      address: "Agartala-ready OPD, diagnostics, and reporting desk"
    }
  });

  const doctorRecords = [];
  for (const doctor of doctors) {
    doctorRecords.push(
      await prisma.doctor.create({
        data: {
          ...doctor,
          branchId: branch.id
        }
      })
    );
  }

  const serviceRecords = [];
  for (const service of services) {
    const created = await prisma.service.create({
      data: {
        slug: service.slug,
        name: service.name,
        category: service.category,
        description: service.description,
        turnaroundTime: service.turnaroundTime,
        price: service.price,
        isPackage: service.isPackage
      }
    });

    serviceRecords.push(created);

    if (service.category !== "OPD") {
      await prisma.labTest.create({
        data: {
          serviceId: created.id,
          specimen: service.specimen,
          preparation: service.preparation
        }
      });
    }
  }

  const patientOne = await prisma.patient.create({
    data: {
      registration: "PAT-1001",
      fullName: "Rina Das",
      phone: "9000000001",
      email: "rina@example.com",
      gender: "Female",
      branchId: branch.id
    }
  });

  const patientTwo = await prisma.patient.create({
    data: {
      registration: "PAT-1002",
      fullName: "Sanjib Roy",
      phone: "9000000002",
      email: "sanjib@example.com",
      gender: "Male",
      branchId: branch.id
    }
  });

  const patientThree = await prisma.patient.create({
    data: {
      registration: "PAT-1003",
      fullName: "Rahul Deb",
      phone: "9000000003",
      email: "rahul@example.com",
      gender: "Male",
      branchId: branch.id
    }
  });

  const appointmentOne = await prisma.appointment.create({
    data: {
      bookingNumber: "APT-240401",
      patientId: patientOne.id,
      doctorId: doctorRecords[0].id,
      branchId: branch.id,
      appointmentDate: new Date("2026-04-04T10:30:00+05:30"),
      status: AppointmentStatus.CONFIRMED,
      visitType: "OPD",
      notes: "Routine physician review"
    }
  });

  const appointmentTwo = await prisma.appointment.create({
    data: {
      bookingNumber: "APT-240402",
      patientId: patientTwo.id,
      doctorId: doctorRecords[2].id,
      branchId: branch.id,
      appointmentDate: new Date("2026-04-04T13:00:00+05:30"),
      status: AppointmentStatus.PENDING,
      visitType: "OPD",
      notes: "Stomach pain follow-up"
    }
  });

  await prisma.bill.createMany({
    data: [
      {
        billNumber: "BIL-1001",
        patientId: patientOne.id,
        branchId: branch.id,
        appointmentId: appointmentOne.id,
        amount: 400,
        discountAmount: 0,
        paymentStatus: PaymentStatus.PAID
      },
      {
        billNumber: "BIL-1002",
        patientId: patientTwo.id,
        branchId: branch.id,
        appointmentId: appointmentTwo.id,
        amount: 700,
        discountAmount: 0,
        paymentStatus: PaymentStatus.UNPAID
      }
    ]
  });

  const thyroidService = await prisma.labTest.findFirstOrThrow({
    where: { service: { slug: "thyroid-profile" } }
  });
  const cbcService = await prisma.labTest.findFirstOrThrow({
    where: { service: { slug: "complete-blood-count" } }
  });

  const labOrderOne = await prisma.labOrder.create({
    data: {
      bookingNumber: "LAB-240501",
      patientId: patientOne.id,
      branchId: branch.id,
      serviceId: thyroidService.id,
      status: LabOrderStatus.REPORT_READY,
      sampleCode: "SMP-001",
      notes: "Priority thyroid follow-up"
    }
  });

  const labOrderTwo = await prisma.labOrder.create({
    data: {
      bookingNumber: "LAB-240502",
      patientId: patientThree.id,
      branchId: branch.id,
      serviceId: cbcService.id,
      status: LabOrderStatus.IN_PROCESS,
      sampleCode: "SMP-002"
    }
  });

  await prisma.bill.createMany({
    data: [
      {
        billNumber: "BIL-1003",
        patientId: patientOne.id,
        branchId: branch.id,
        labOrderId: labOrderOne.id,
        amount: 850,
        discountAmount: 0,
        paymentStatus: PaymentStatus.PAID
      },
      {
        billNumber: "BIL-1004",
        patientId: patientThree.id,
        branchId: branch.id,
        labOrderId: labOrderTwo.id,
        amount: 350,
        discountAmount: 0,
        paymentStatus: PaymentStatus.PARTIAL
      }
    ]
  });

  await prisma.report.createMany({
    data: [
      {
        patientId: patientOne.id,
        labOrderId: labOrderOne.id,
        title: "Thyroid Profile Report",
        fileUrl: "/reports/sample-thyroid-profile.pdf",
        visibility: ReportVisibility.PUBLISHED,
        publishedAt: new Date("2026-04-03T14:30:00+05:30")
      },
      {
        patientId: patientThree.id,
        labOrderId: labOrderTwo.id,
        title: "CBC Report",
        fileUrl: "/reports/sample-cbc-report.pdf",
        visibility: ReportVisibility.INTERNAL
      }
    ]
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
