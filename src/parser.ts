interface IRecipient {
  name: string;
  phoneNumber: string;
  quantities: string[];
  races: string[];
  vaccines: string[];
  address: string;
  buildings: string[];
  deliveryDate: string[];
  deliveryTime: string[];
}
function removeDuplicates<T>(arr: Array<T>): Array<T> {
  return arr.filter(function (value, index, array) {
    return array.indexOf(value) === index;
  });
}

function readFile(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (ev) => {
      const result = ev.target?.result?.toString();
      if (!result) {
        throw Error("Failed to read file");
      }
      resolve(result);
    };
    reader.readAsText(file, "UTF-8");
  });
}

function parseVaccine(vaccine: string): string {
  if (!vaccine) {
    return "";
  }
  // the vaccine often contains un-necessary '+', remove them
  for (let i = vaccine.length - 1; i >= 0; i--) {
    if (vaccine[i] !== "+" && vaccine[i] !== " ") {
      vaccine = vaccine.slice(0, i + 1);
      break;
    }
  }
  return vaccine.trim();
}

function parseRawFile(fileContent: string): IRecipient[] {
  const recipients: IRecipient[] = [];
  fileContent
    // split by line
    .split("\n")
    // remove the first line
    .slice(1)
    .forEach((line) => {
      if (line.trim().length === 0) {
        return;
      }
      const [
        quantity,
        race,
        phoneNumber,
        vaccine,
        buildingNumber,
        address,
        deliveryDate,
        deliveryTime,
        name,
      ] = line.split(";");

      recipients.push({
        quantities: [quantity?.trim()],
        races: [race?.trim()],
        phoneNumber: phoneNumber?.trim().replaceAll(" ", ""),
        vaccines: [parseVaccine(vaccine)],
        buildings: [buildingNumber?.trim()],
        address: address?.trim(),
        deliveryDate: [deliveryDate?.trim()],
        deliveryTime: [deliveryTime?.trim()],
        name: name?.trim(),
      });
    });
  return recipients;
}

function mergeRecipients(recipients: IRecipient[]): IRecipient[] {
  const mergedRecipients: IRecipient[] = [];
  recipients.forEach((recipient) => {
    // don't merge this one if it has already been merged.
    if (mergedRecipients.find((r) => r.phoneNumber === recipient.phoneNumber)) {
      return;
    }
    // get all recipients with that phone number
    recipients
      .filter((r) => r.phoneNumber === recipient.phoneNumber)
      .forEach((r) => {
        recipient.buildings = removeDuplicates([
          ...recipient.buildings,
          ...r.buildings,
        ]);
        recipient.vaccines = removeDuplicates([
          ...recipient.vaccines,
          ...r.vaccines,
        ]);
        recipient.quantities = [...recipient.quantities, ...r.quantities];
        recipient.races = removeDuplicates([...recipient.races, ...r.races]);
        recipient.deliveryDate = removeDuplicates([
          ...recipient.deliveryDate,
          ...r.deliveryDate,
        ]);
        recipient.deliveryTime = removeDuplicates([
          ...recipient.deliveryTime,
          ...r.deliveryTime,
        ]);
      });
    mergedRecipients.push(recipient);
  });
  return mergedRecipients;
}

function convertToCSV(recipients: IRecipient[]): string {
  let result: string[] = [
    "Numero;Quantite_Commandee;Croisement;Vaccin cv;Numero_Batiment;Adresse_1;Date_Eclosion;horaire;Nom;",
  ];
  recipients.forEach((r) => {
    // quit if phone number is not found
    if (!r.phoneNumber) {
      return;
    }
    result.push(
      `${r.phoneNumber};${r.quantities.join(" + ")};${r.races.join(
        " + "
      )};${r.vaccines.join(" + ")};${r.buildings.join(" + ")};${
        r.address
      };${r.deliveryDate.join(" puis le ")};${r.deliveryTime.join(
        " puis à "
      )};${r.name}`
    );
  });
  return result.join("\n");
}

export async function parseFile(file: File): Promise<string> {
  const fileContent = await readFile(file);
  const recipients = mergeRecipients(parseRawFile(fileContent));

  return convertToCSV(recipients);
}
