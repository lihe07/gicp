import { Button, Card, Box, CardBody, CardHeader, FormControl, FormHelperText, FormLabel, Heading, Input, Text, InputGroup, InputLeftAddon, Textarea, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Formik, FormikHelpers, Field } from "formik";
import { Form as FormikForm } from 'formik'

interface Form {
    name: string,
    email: string,
    phone: string,
    domain: string,
    href: string,
    note: string
}

const empty: Form = {
    name: '',
    email: '',
    phone: '',
    domain: '',
    href: '',
    note: ''
}

function validateName(value: string) {
    if (!value) return "请填写姓名"
}

function validateEmail(value: string) {

}

function validateDomain(value: string) {

}

function validateHref(value: string) {

}


function validatePhone(value: string) {
    if (value) {
        if (isNaN(parseInt(value))) return "无效的手机号"
        if (value.length != 11) return "手机号应有11位"
    }
}




interface FieldProps {
    name: string,
    placeholder: string,
    type: string,
    helper: any,
    label: string,
    validate: any,
    mt?: string
}

function QuickField(props: FieldProps) {
    return (
        <Field name={props.name} validate={props.validate}>
            {({ field, form }: any) => (
                <FormControl mt={props.mt} isRequired isInvalid={form.errors[props.name] && form.touched[props.name]}>
                    <FormLabel>{props.label}</FormLabel>
                    <Input placeholder={props.placeholder} type={props.type} {...field}></Input>
                    <FormHelperText>
                        {props.helper}
                    </FormHelperText>
                    <FormErrorMessage>
                        {form.errors[props.name]}
                    </FormErrorMessage>
                </FormControl>
            )}
        </Field>
    )
}

export default function Form() {
    const toast = useToast()

    function onSubmit(values: Form, actions: FormikHelpers<Form>) {
        const payload = {
            ...values,
            id: -1,
            approved: false
        }
        const api = "/api/list"
        fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => {
            console.log(res);
            actions.setSubmitting(false)
            if (res.status == 200) {
                actions.resetForm()
                toast({
                    title: "提交成功",
                    description: "您的申请已提交，我们会尽快处理",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "提交失败",
                    description: "请检查网络连接",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        })
    }

    return (
        <>
            <Formik initialValues={empty} onSubmit={onSubmit}>
                {props => (
                    <FormikForm>
                        <Card mt="10">
                            <CardHeader>
                                <Heading size="md">联系方式</Heading>
                            </CardHeader>
                            <CardBody>
                                <QuickField name="name" label="姓名" validate={validateName} helper="我们如何称呼您？（此字段不会公开展示）" type="text" placeholder="张三" />
                                <QuickField name="email" label="邮箱" validate={validateEmail} helper="您的联系邮箱，请确保真实有效，此字段不会公开展示" type="email" placeholder="me@example.com" mt="5" />

                                <Field name="phone" validate={validatePhone}>
                                    {({ field, form }: any) => (
                                        <FormControl mt="5" isInvalid={form.errors.phone && form.touched.phone}>
                                            <FormLabel>电话</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon>
                                                    +86
                                                </InputLeftAddon>
                                                <Input placeholder="12312341234" type="tel" {...field}></Input>
                                            </InputGroup>
                                            <FormHelperText>
                                                您的手机号码，此字段不会公开展示
                                            </FormHelperText>
                                            <FormErrorMessage>
                                                {form.errors.phone}
                                            </FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>

                            </CardBody>
                        </Card>

                        <Card mt="10">
                            <CardHeader>
                                <Heading size="md">网站信息</Heading>
                            </CardHeader>
                            <CardBody>

                                <QuickField name="domain" label="域名" validate={validateDomain} helper="您网站的域名，无需包含子域（如www前缀）" placeholder="example.com" type="text" />

                                <QuickField name="href" label="首页链接" validate={validateHref} helper={<span>您希望在我们网站上展示的链接，请包含具体协议（如 <code>https://</code> 前缀）</span>} placeholder="https://www.example.com/" type="text" mt="5" />

                            </CardBody>
                        </Card>


                        <Card mt="10">
                            <CardHeader>
                                <Heading size="md">备注</Heading>
                            </CardHeader>
                            <CardBody>
                                {/* <FormControl>
                                    <FormLabel>备注文本</FormLabel>
                                    <Textarea></Textarea>
                                    <FormHelperText>
                                        如果您有其他内容需要备注，请在这里填写，此字段会公开展示
                                    </FormHelperText>
                                </FormControl> */}

                                <Field name="note">
                                    {({ field }: any) => (
                                        <FormControl>
                                            <FormLabel>备注文本</FormLabel>
                                            <Textarea {...field}></Textarea>
                                            <FormHelperText>
                                                如果您有其他内容需要备注，请在这里填写，此字段会公开展示
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                </Field>

                            </CardBody>

                        </Card>

                        <Box mt="10" mb="10" display="flex" flexDirection="row" justifyContent="space-between" >
                            <Button colorScheme="yellow" onClick={() => props.resetForm()}>重置</Button>
                            <Button colorScheme="blue" isLoading={props.isSubmitting} type="submit">提交</Button>
                        </Box>
                    </FormikForm>
                )}
            </Formik>
        </>
    )
}