import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications"
import leftArrowIcon from "assets/leftArrow.svg";
import linkedinIcon from "assets/linkedin.svg";
import mailIcon from "assets/mail.svg";
import phoneIcon from "assets/phoneCall.svg";
import userPlus from "assets/userPlusWhite.svg";
import notification from "components/utils/notification"
import { createContact } from "crm/CRMService"
import { useDispatch } from "react-redux";
import { useParams } from "react-router"
import { setSelectedContactPage } from "reducer/crmSlice";

function CreateContact() {
  const dispatch = useDispatch();
  const {workspaceId} = useParams<{workspaceId: string}>()

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      company: "",
      jobPosition: "",
      emailAddress: "",
      phoneNumber: "",
      linkedin: "",
    },
    validate: {
      // emailAddress: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const labelStyles = {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    letterSpacing: "0em",
    color: "#344054",
  };

  const handleBack = () => {
    dispatch(setSelectedContactPage({ type: "all" }));
  };

  const handleSubmit = async (data: any) => {
    try {
      data.workspaceId = workspaceId
      const res = await createContact(data);
      console.log(res);
      showNotification({
        title: "Success",
        message: "Contact created successfully",
        color: "blue",
        icon: null,
        autoClose: 5000
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group m="lg" position="apart">
        <Flex
          align={"center"}
          gap={8}
          onClick={handleBack}
          style={{
            cursor: "pointer",
          }}
        >
          <Image
            maw={16}
            color="#FFFFFF"
            mx="auto"
            src={leftArrowIcon}
            alt="back"
          />
          <Text size={14} weight={600} color="#3054B9">
            Contacts
          </Text>
          <Text size={14} weight={600} color="#3054B9">
            /
          </Text>
          <Text size={14} weight={600}>
            Create
          </Text>
        </Flex>
        <Button
          type="submit"
          style={{
            borderRadius: "8px",
            paddingTop: "8px",
            paddingBottom: "8px",
            color: "#FFFFFF",
            paddingLeft: "14px",
            border: "1px solid #3C69E7",
            paddingRight: "14px",
            marginRight: "10px",
            background: "#3C69E7",
          }}
          radius="xs"
          size="xs"
          fw={600}
          fs={{
            fontSize: "14px",
          }}
          leftIcon={
            <Image maw={15} mx="auto" src={userPlus} alt="add contact" />
          }
          color="dark"
          variant="outline"
        >
          Add Contact
        </Button>
      </Group>
      <Box mx="auto" mt="md" maw={452}>
        <TextInput
          label="First Name"
          placeholder="First Name"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("firstName")}
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("lastName")}
        />
        <TextInput
          label="Company"
          placeholder="Company"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("company")}
        />
        <TextInput
          label="Position"
          placeholder="Position"
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("position")}
        />
        <TextInput
          label="Email"
          placeholder="your@email.com"
          icon={<Image maw={16} mx="auto" src={mailIcon} alt="mail" />}
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("emailAddress")}
        />
        <TextInput
          label="Phone Number"
          placeholder="Phone Number"
          icon={<Image maw={16} mx="auto" src={phoneIcon} alt="phone" />}
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("phoneNumber")}
        />
        <TextInput
          label="LinkedIn"
          placeholder="LinkedIn"
          icon={<Image maw={16} mx="auto" src={linkedinIcon} alt="linkedin" />}
          radius="md"
          labelProps={{ style: labelStyles }}
          {...form.getInputProps("linkedin")}
        />
        <Button className="primary" type="submit"> Add </Button>
      </Box>
    </form>
  );
}

export default CreateContact;