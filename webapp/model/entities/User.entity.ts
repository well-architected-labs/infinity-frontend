export class User {
    id?: string
    email: string
    password: string
    person: Person
    role: Role
}

export class Person {
    id?: string
    firstName: string
    lastName: string
    taxId: string
    bio: Bio
    phone: Phone
    skills: Skill[]
    skillsTemp: string[]
}

export class Skill {
    id: string
    name: string
    description: string
}

export class Phone {
    id?: string
    ddi: string
    ddd: string
    number: string
}

export class Bio {
    id?: string
    about: string
    resume: string
    linkedin: string
    webSite: string
    experiences: Experience[]
    educations: Education[]

}

export class Education {
    id?: string
    name: string
    description: string
    dateInit: string
    dateEnd: string
}

export class Experience {
    id?: string
    name: string
    description: string
    dateInit: string
    dateEnd: string
    current: boolean
}


export class Role {
    id?: string
    name: string
    alias: string
    scopes: Scope[]
}

export class Scope {
    id?: string
    name: string
    alias: string
    description: string
}