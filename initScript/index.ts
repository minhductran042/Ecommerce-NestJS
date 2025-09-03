import { create } from "domain";
import envConfig from "shared/config";
import { RoleName } from "shared/constants/role.constant";
import { HashingService } from "shared/services/hashing.service";
import { PrismaService } from "shared/services/prisma.service";

const prisma = new PrismaService();
const hashingService = new HashingService();

const main = async () => {
    const roleCount = await prisma.role.count();
    if(roleCount > 0 ) {
        throw new Error('Roles already exist in the database. Aborting initialization.');
    }
    const roles = await prisma.role.createMany({
        data: [
            {
                name: RoleName.ADMIN,
                description: 'Admin Role'
            }, 
            {
                name: RoleName.USER,
                description: 'User Role'
            },
            {
                name: RoleName.SELLER,
                description: 'Seller Role'
            }
        ]
    })

    const adminRole = await prisma.role.findFirstOrThrow({ // chắc chắn tìm thấy vai trò ADMIN
        where: {
            name : RoleName.ADMIN
        }
    })

    const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD);

    const adminUser = await prisma.user.create({
        data: {
            email: envConfig.ADMIN_EMAIL,
            password: hashedPassword,
            name: envConfig.ADMIN_NAME,
            phoneNumber: envConfig.ADMIN_PHONENUMBER,
            roleId: adminRole.id
        }
    })
    
    return {
        createdRoleCount: roles.count,
        adminUser
    }
}

main().then(({ adminUser, createdRoleCount }) => { // đây là cách sử dụng destructuring để lấy giá trị từ đối tượng trả về
    console.log(`Created ${createdRoleCount} roles.`);
    console.log('Admin user created:', adminUser.email);
}).catch((error) => {
    console.error('Initialization failed:', error);
    process.exit(1);
});
